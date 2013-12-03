/**
 * @class Oskari.mapframework.bundle.backendstatus.BackendStatusBundleInstance
 *
 * Utility bundle to manage updating backend status information.
 * Updates information only when LayerSelector2 is being opened.
 *
 */
Oskari.clazz.define("Oskari.mapframework.bundle.backendstatus.BackendStatusBundleInstance",

    /**
     * @method create called automatically on construction
     * @static
     */

    function () {
        this._localization = null;
        this._sandbox = null;
        this._started = false;
        this._pendingAjaxQuery = {
            busy: false,
            jqhr: null,
            timestamp: null
        };

        this.timeInterval = this.ajaxSettings.defaultTimeThreshold;
        this.backendStatus = {};
        this.backendExtendedStatus = {};

        /* IE debug ... */
        this.gotStartupEvent = false;
        this.gotStartupTimeoutEvent = false;
        this.gotStartupProcessCall = false;

        /* maplayerservice */
        this._mapLayerService = null;

    }, {
        ajaxSettings: {
            defaultTimeThreshold: 15000
        },
        /**
         * @method getLocalization
         * Returns JSON presentation of bundles localization data for
         * current language.
         * If key-parameter is not given, returns the whole localization
         * data.
         *
         * @param {String} key (optional) if given, returns the value for
         *         key
         * @return {String/Object} returns single localization string or
         *      JSON object for complete data depending on localization
         *      structure and if parameter key is given
         */
        getLocalization: function (key) {
            if (!this._localization) {
                this._localization = Oskari.getLocalization(this.getName());
            }
            if (key) {
                return this._localization[key];
            }
            return this._localization;
        },
        /**
         * @static
         * @property __name
         */
        __name: 'BackendStatus',
        /**
         * @method getName
         * @return {String} the name for the component
         */
        "getName": function () {
            return this.__name;
        },
        /**
         * @method setSandbox
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         * Sets the sandbox reference to this component
         */
        setSandbox: function (sandbox) {
            this._sandbox = sandbox;
        },
        /**
         * @method getSandbox
         * @return {Oskari.mapframework.sandbox.Sandbox}
         */
        getSandbox: function () {
            return this._sandbox;
        },
        getAjaxUrl: function (key, allKnown) {
            var ajaxUrl = this.getSandbox().getAjaxUrl();
            var url = null;

            if (allKnown) {
                url = ajaxUrl + 'action_route=GetBackendStatus&Subset=AllKnown';
            } else {
                url = ajaxUrl + 'action_route=GetBackendStatus&Subset=Alert';
            }

            return url;
            /*return 'GetBackendStatus.json';*/
        },
        /**
         * @method start
         * implements BundleInstance protocol start method
         */
        "start": function () {
            var me = this;

            if (me._started) {
                return;
            }

            me._started = true;

            var conf = me.conf,
                sandboxName = (conf ? conf.sandbox : null) || 'sandbox',
                sandbox = Oskari.getSandbox(sandboxName),
                p;

            me._sandbox = sandbox;

            me._mapLayerService = sandbox.getService("Oskari.mapframework.service.MapLayerService");

            sandbox.register(me);
            for (p in me.eventHandlers) {
                if (me.eventHandlers.hasOwnProperty(p)) {
                    sandbox.registerForEventByName(me, p);
                }
            }

            /* we may have missed the maplayerevent */
            if (me._mapLayerService.isAllLayersLoaded() && !me.gotStartupProcessCall) {
                me.updateBackendStatus(true);
            }
        },
        /**
         * @method init
         * implements Module protocol init method - does nothing atm
         */
        "init": function () {
            return null;
        },
        /**
         * @method update
         * implements BundleInstance protocol update method - does nothing atm
         */
        "update": function () {

        },
        /**
         * @method onEvent
         * @param {Oskari.mapframework.event.Event} event a Oskari event object
         * Event is handled forwarded to correct #eventHandlers if found or discarded if not.
         */
        onEvent: function (event) {

            var handler = this.eventHandlers[event.getName()];
            if (!handler) {
                return;
            }

            return handler.apply(this, [event]);

        },
        /**
         * @property extensionsByName
         * @static
         * extensions that trigger update
         *
         */
        extensionsByName: {
            'LayerSelector': true
        },

        /**
         * @property extensionStatesByName
         * @static
         * extension states that trigger update
         *
         */
        extensionStatesByName: {
            'attach': true,
            'detach': true
        },

        /**
         * @property {Object} eventHandlers
         * @static
         */
        eventHandlers: {

            /**
             * @method ExtensionUpdatedEvent
             */
            'userinterface.ExtensionUpdatedEvent': function (event) {

                var extension = event.getExtension();
                if (!extension) {
                    return;
                }
                var extensionName = extension.getName();
                if (!extensionName) {
                    return;
                }
                if (!this.extensionsByName[extensionName]) {
                    return;
                }
                var extensionViewState = event.getViewState();

                if (!this.extensionStatesByName[extensionViewState]) {
                    return;
                }

                this.updateBackendStatus();
            },
            /**
             * @method AfterShowMapLayerInfoEvent
             */

            'AfterShowMapLayerInfoEvent': function (event) {

                var mapLayer = event.getMapLayer();
                var mapLayerId = mapLayer.getId();
                var mapLayerBackendStatus = mapLayer.getBackendStatus();
                /*console.log("ABOUT to show information for "+mapLayerId,mapLayer,mapLayerBackendStatus);*/

                /*if(!mapLayerBackendStatus) {
             this.showFeedbackDialog('missing_backendstatus_status');
             return;
             }*/

                var backendExtendedStatusForLayer = this.backendExtendedStatus[mapLayerId];

                /*console.log("MIGHT show information for "+mapLayerId,mapLayer,backendExtendedStatusForLayer);*/

                if (!backendExtendedStatusForLayer) {
                    this.showFeedbackDialog('missing_backendstatus_information');
                    return;
                }

                var infoUrl = backendExtendedStatusForLayer.infourl;
                if (!infoUrl) {
                    this.showFeedbackDialog('missing_backendstatus_infourl');
                    return;
                }

                /*console.log("WOULD show information for "+mapLayerId,mapLayer,infoUrl);*/

                this.openURLinWindow(infoUrl);
            },
            'MapLayerEvent': function (event) {
                // FIXME use ===
                if (!((event.getLayerId() === null || event.getLayerId() === undefined) && event.getOperation() === 'add')) {
                    return;
                }

                /* this is where we get after layers.json has been read from server to maplayer service */
                /* we do not know the order of bundles and modules notifications though */
                var me = this;
                me.gotStartupEvent = true;
                window.setTimeout(function () {
                    me.gotStartupTimeoutEvent = true;
                    me.updateBackendStatus(true);
                }, 15);
            }
        },

        /**
         *
         */
        showFeedbackDialog: function (context) {
            var feedBackTextx = this.getLocalization('feedback')[context],
                dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            dialog.show(feedBackTextx.title, feedBackTextx.message);
            dialog.fadeout();

        },
        openURLinWindow: function (infoUrl) {
            var wopParm = "location=1," + "status=1," + "scrollbars=1," + "width=850," + "height=1200",
                link = infoUrl;
            window.open(link, "BackendStatus", wopParm);
        },
        /**
         * @method stop
         * implements BundleInstance protocol stop method
         */
        "stop": function () {

            var me = this,
                sandbox = me._sandbox,
                p;

            me._cancelAjaxRequest();

            for (p in me.eventHandlers) {
                if (me.eventHandlers.hasOwnProperty(p)) {
                    sandbox.unregisterFromEventByName(this, p);
                }
            }

            sandbox.unregister(this);
            this._started = false;
            this._sandbox = null;
        },
        /**
         * @method getTitle
         * @return {String} localized text for the title of the component
         */
        getTitle: function () {
            return 'Backend Status';
        },
        /**
         * @method getDescription
         * @return {String} localized text for the description of the component
         */
        getDescription: function () {
            return 'Backend Status';
        },
        _cancelAjaxRequest: function () {
            var me = this;
            if (!me._pendingAjaxQuery.busy) {
                return;
            }
            var jqhr = me._pendingAjaxQuery.jqhr;
            me._pendingAjaxQuery.jqhr = null;
            if (!jqhr) {
                return;
            }
            this._sandbox.printDebug("[BackendStatus] Abort jqhr ajax request");
            jqhr.abort();
            jqhr = null;
            me._pendingAjaxQuery.busy = false;
        },
        _startAjaxRequest: function (dteMs) {
            var me = this;
            me._pendingAjaxQuery.busy = true;
            me._pendingAjaxQuery.timestamp = dteMs;

        },
        _finishAjaxRequest: function () {
            var me = this;
            me._pendingAjaxQuery.busy = false;
            me._pendingAjaxQuery.jqhr = null;
            this._sandbox.printDebug("[BackendStatus] finished jqhr ajax request");
        },
        _notifyAjaxFailure: function () {
            var me = this;
            me._sandbox.printDebug("[BackendStatus] BackendStatus AJAX failed");
            me._processResponse({
                backendstatus: []
            });
        },
        _isAjaxRequestBusy: function () {
            var me = this;
            return me._pendingAjaxQuery.busy;
        },
        updateBackendStatus: function (allKnown) {
            var me = this;
            me.gotStartupProcessCall = me.gotStartupProcessCall || allKnown;
            var sandbox = me._sandbox;
            if (!allKnown && me._pendingAjaxQuery.busy) {
                sandbox.printDebug("[BackendStatus] updateBackendStatus NOT SENT previous query is busy");
                return;
            }
            var dte = new Date();
            var dteMs = dte.getTime();

            if (!allKnown && me._pendingAjaxQuery.timestamp && dteMs - me._pendingAjaxQuery.timestamp < me.timeInterval) {
                sandbox.printDebug("[BackendStatus] updateBackendStatus NOT SENT (time difference < " + me.timeInterval + "ms)");
                return;
            }

            me._cancelAjaxRequest();
            me._startAjaxRequest(dteMs);

            var ajaxUrl = me.getAjaxUrl(null, allKnown);

            jQuery.ajax({
                beforeSend: function (x) {
                    me._pendingAjaxQuery.jqhr = x;
                    if (x && x.overrideMimeType) {
                        x.overrideMimeType("application/j-son;charset=UTF-8");
                    }
                },
                success: function (resp) {
                    me._finishAjaxRequest();
                    me._processResponse(resp, allKnown);
                },
                error: function () {
                    me._finishAjaxRequest();
                    me._notifyAjaxFailure();
                },
                always: function () {
                    me._finishAjaxRequest();
                },
                complete: function () {
                    me._finishAjaxRequest();
                },
                data: {},
                type: 'POST',
                dataType: 'json',
                url: ajaxUrl
                /*url : 'GetBackendStatus.json'*/
            });
        },
        _processResponse: function (resp, allKnown) {
            var me = this;
            var sandbox = this._sandbox;
            if (!resp) {
                sandbox.printDebug("[BackendStatus] empty data from server");
                return;
            }

            var backendStatusArr = resp.backendstatus;
            // FIXME use ===
            if (!backendStatusArr || backendStatusArr.length === undefined) {
                sandbox.printDebug("[BackendStatus] backendStatus NO data");
                return;
            }

            var evtBuilder = sandbox.getEventBuilder('MapLayerEvent'),
                changeNotifications = {};

            /* let's update AllKnown */
            var extendedStatuses = allKnown ? {} : this.backendExtendedStatus,
                n,
                data,
                layerId,
                p;

            for (n = 0; n < backendStatusArr.length; n += 1) {
                data = backendStatusArr[n];
                layerId = data.maplayer_id;
                if (!this.backendStatus[layerId]) {
                    changeNotifications[layerId] = {
                        status: data.status,
                        changed: true
                    };
                    extendedStatuses[layerId] = data;
                    /*sandbox.printDebug("[BackendStatus] "+layerId+" new alert");*/
                    // FIXME use !==
                } else if (this.backendStatus[layerId].status !== data.status) {
                    changeNotifications[layerId] = {
                        status: data.status,
                        changed: true
                    };
                    extendedStatuses[layerId] = data;
                    /*sandbox.printDebug("[BackendStatus] "+layerId+" changed alert");*/
                } else {
                    changeNotifications[layerId] = {
                        status: data.status,
                        changed: false
                    };
                    extendedStatuses[layerId] = data;
                }
            }

            for (p in me.backendStatus) {
                if (me.backendStatus.hasOwnProperty(p)) {
                    // FIXME use !==
                    if (!changeNotifications[p] && this.backendStatus[p].status !== null && this.backendStatus[p].status !== undefined) {
                        changeNotifications[p] = {
                            status: null,
                            changed: true
                        };
                        /*sandbox.printDebug("[BackendStatus] "+p+" alert closed");*/
                    }
                }
            }

            this.backendExtendedStatus = extendedStatuses;

            var maplayers = {};

            for (p in changeNotifications) {
                if (changeNotifications.hasOwnProperty(p)) {
                    this.backendStatus[p] = changeNotifications[p];

                    var maplayer = sandbox.findMapLayerFromAllAvailable(p);
                    if (maplayer) {
                        maplayer.setBackendStatus(this.backendStatus[p].status);
                        /* forcing DOWN to be notified - we do not know if layerselector2 has shown the msg or not...*/
                        if (changeNotifications[p].changed || "DOWN" === maplayer.getBackendStatus()) {
                            maplayers[p] = maplayer;
                        }
                    }
                }
            }

            if (allKnown) {
                me._pendingAjaxQuery.timestamp = null;
                me.backendStatus = {};
            } else {
                var evt;
                for (p in maplayers) {
                    if (maplayers.hasOwnProperty(p)) {
                        evt = evtBuilder(p, 'update');
                        sandbox.notifyAll(evt);
                    }
                }
            }
        }
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        "protocol": ["Oskari.bundle.BundleInstance", 'Oskari.mapframework.module.Module']
    });