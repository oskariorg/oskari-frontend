/**
 * @class Oskari.harava.bundle.mapmodule.plugin.HaravaGetInfoPlugin
 */
Oskari.clazz.define('Oskari.harava.bundle.mapmodule.plugin.HaravaGetInfoPlugin',

    /**
     * @method create called automatically on construction
     * @static
     */

    function () {
        this.mapModule = null;
        this.pluginName = null;
        this._sandbox = null;
        this._map = null;
        this.enabled = true;
        this.infoboxId = 'getinforesult';
        this._pendingAjaxQuery = {
            busy: false,
            jqhr: null,
            timestamp: null
        };
    }, {
        /** @static @property __name plugin name */
        __name: 'HaravaGetInfoPlugin',

        /**
         * @method getName
         * @return {String} plugin name
         */
        getName: function () {
            return this.pluginName;
        },
        /**
         * @method getMapModule
         * @return {Oskari.mapframework.ui.module.common.MapModule}
         * reference to map
         * module
         */
        getMapModule: function () {
            return this.mapModule;
        },
        /**
         * @method setMapModule
         * @param {Oskari.mapframework.ui.module.common.MapModule}
         * reference to map
         * module
         */
        setMapModule: function (mapModule) {
            this.mapModule = mapModule;
            if (mapModule) {
                this.pluginName = mapModule.getName() + this.__name;
            }
        },
        /**
         * @method hasUI
         * @return {Boolean} true
         * This plugin has an UI so always returns true
         */
        hasUI: function () {
            return true;
        },
        /**
         * @method init
         *
         * Interface method for the module protocol
         *
         * @param {Oskari.Sandbox} sandbox
         *          reference to application sandbox
         */
        init: function (sandbox) {
            var me = this;
            this._sandbox = sandbox;
            this._sandbox.printDebug("[GetInfoPlugin] init");
            this.getGFIHandler = Oskari.clazz.create('Oskari.mapframework.bundle.mapmodule.getinfo.GetFeatureInfoHandler', me);
        },
        /**
         * @method register
         * Interface method for the plugin protocol
         */
        register: function () {

        },
        /**
         * @method unregister
         * Interface method for the plugin protocol
         */
        unregister: function () {

        },
        /**
         * @method startPlugin
         *
         * Interface method for the plugin protocol
         *
         * @param {Oskari.Sandbox} sandbox
         *          reference to application sandbox
         */
        startPlugin: function (sandbox) {
            var me = this,
                p;
            if (sandbox && sandbox.register) {
                this._sandbox = sandbox;
            }
            this._map = this.getMapModule().getMap();

            this._sandbox.register(this);
            for (p in this.eventHandlers) {
                this._sandbox.registerForEventByName(this, p);
            }
            this._sandbox.addRequestHandler('MapModulePlugin.GetFeatureInfoRequest', this.getGFIHandler);
            this._sandbox.addRequestHandler('MapModulePlugin.GetFeatureInfoActivationRequest', this.getGFIHandler);
        },
        /**
         * @method stopPlugin
         *
         * Interface method for the plugin protocol
         *
         * @param {Oskari.Sandbox} sandbox
         *          reference to application sandbox
         */
        stopPlugin: function (sandbox) {
            var me = this,
                p;
            // hide infobox if open
            me._closeGfiInfo();

            if (sandbox && sandbox.register) {
                this._sandbox = sandbox;
            }

            for (p in this.eventHandlers) {
                this._sandbox.unregisterFromEventByName(this, p);
            }
            this._sandbox.unregister(this);
            this._map = null;
            this._sandbox = null;
        },
        /**
         * @method start
         *
         * Interface method for the module protocol
         *
         * @param {Oskari.Sandbox} sandbox
         *          reference to application sandbox
         */
        start: function (sandbox) {},
        /**
         * @method stop
         *
         * Interface method for the module protocol
         *
         * @param {Oskari.Sandbox} sandbox
         *          reference to application sandbox
         */
        stop: function (sandbox) {},
        /**
         * @method setEnabled
         * Enables or disables gfi functionality
         * @param {Boolean} blnEnabled
         *          true to enable, false to disable
         */
        setEnabled: function (blnEnabled) {
            this.enabled = (blnEnabled === true);
            // close existing if disabled
            if (!this.enabled) {
                this._closeGfiInfo();
            }
        },
        /**
         * @property {Object} eventHandlers
         * @static
         */
        eventHandlers: {
            'EscPressedEvent': function (evt) {
                this._closeGfiInfo();
            },
            'MapClickedEvent': function (evt) {
                if (!this.enabled) {
                    // disabled, do nothing
                    return;
                }
                var lonlat = evt.getLonLat();
                var x = evt.getMouseX();
                var y = evt.getMouseY();
                this.handleGetInfo(lonlat, x, y);
            },
            'AfterMapMoveEvent': function (evt) {
                this._cancelAjaxRequest();
            }
        },
        /**
         * @method onEvent
         * @param {Oskari.mapframework.event.Event} event a Oskari event object
         * Event is handled forwarded to correct #eventHandlers if found or discarded
         * if not.
         */
        onEvent: function (event) {
            var me = this;
            return this.eventHandlers[event.getName()].apply(this, [event]);
        },
        /**
         * @method _cancelAjaxRequest
         * @private
         * Cancels ajax request
         */
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
            this._sandbox.printDebug("[GetInfoPlugin] Abort jqhr ajax request");
            jqhr.abort();
            jqhr = null;
            me._pendingAjaxQuery.busy = false;
        },
        /**
         * @method _startAjaxRequest
         * @private
         * Start ajax request
         * @param dteMs {Integer} Datetime timestamp in milliseconds
         */
        _startAjaxRequest: function (dteMs) {
            var me = this;
            me._pendingAjaxQuery.busy = true;
            me._pendingAjaxQuery.timestamp = dteMs;

        },
        /**
         * @method _finishAjaxRequest
         * @private
         * Finish ajax request
         */
        _finishAjaxRequest: function () {
            var me = this;
            me._pendingAjaxQuery.busy = false;
            me._pendingAjaxQuery.jqhr = null;
            this._sandbox.printDebug("[GetInfoPlugin] finished jqhr ajax request");
        },
        /**
         * @method _buildLayerIdList
         * @private
         * @returns {String[]} visible layer ids
         */
        _buildLayerIdList: function () {
            var me = this;
            var selected = me._sandbox.findAllSelectedMapLayers();
            var layerIds = null;

            var mapScale = me._sandbox.getMap().getScale();

            for (var i = 0; i < selected.length; i++) {
                var layer = selected[i];

                if (!layer.isInScale(mapScale)) {
                    continue;
                }
                if (!layer.isFeatureInfoEnabled()) {
                    continue;
                }
                if (!layer.isVisible()) {
                    continue;
                }

                if (!layerIds) {
                    layerIds = "";
                }

                if (layerIds !== "") {
                    layerIds += ",";
                }

                layerIds += layer.getId();
            }

            return layerIds;
        },
        /**
         * @method _getFilters
         * @private
         * @returns {Object[]} visible layer cql filters
         */
        _getFilters: function () {
            var me = this;
            var filtters = '[';
            var visibleLayers = me._buildLayerIdList();

            if (visibleLayers !== null && visibleLayers !== undefined && visibleLayers !== '') {
                var layers = visibleLayers.split(',');
                for (var i = 0; i < layers.length; i++) {
                    var layerId = layers[i];
                    var olLayers = me.mapModule.getOLMapLayers(layerId);
                    if (olLayers !== null && olLayers !== undefined && olLayers.length > 0) {

                        for (var j = 0; j < olLayers.length; j++) {
                            var olLayer = olLayers[j];

                            var cqlFil = olLayer.params.CQL_FILTER;
                            if (cqlFil !== null && cqlFil !== undefined && cqlFil !== '') {
                                if (filtters != '[') {
                                    filtters += ',';
                                }
                                filtters += '{"layerId":"' + layerId + '",' + '"cql":"' + cqlFil + '"}';
                            }
                        }
                    }
                }
            }
            filtters += ']';
            return filtters;
        },
        /**
         * @method _notifyAjaxFailure
         * @private
         * notifying ajax failure
         */
        _notifyAjaxFailure: function () {
            var me = this;
            me._sandbox.printDebug("[GetInfoPlugin] GetFeatureInfo AJAX failed");
        },
        /**
         * @method _isAjaxRequestBusy
         * @private
         * Checks if ajax request is busy
         * @returns {Boolean} true if busy, else false
         */
        _isAjaxRequestBusy: function () {
            var me = this;
            return me._pendingAjaxQuery.busy;
        },

        /**
         * @method handleGetInfo
         * send ajax request to get feature info for given location for any visible layers
         *
         * backend processes given layer (ids) as WMS GetFeatureInfo or WFS requests
         * (or in the future WMTS GetFeatureInfo)
         *
         * aborts any pending ajax query
         *
         */
        handleGetInfo: function (lonlat, x, y) {
            var me = this;

            var dte = new Date();
            var dteMs = dte.getTime();

            if (me._pendingAjaxQuery.busy && me._pendingAjaxQuery.timestamp &&
                dteMs - me._pendingAjaxQuery.timestamp < 500) {
                me._sandbox.printDebug("[GetInfoPlugin] GetFeatureInfo NOT SENT (time difference < 500ms)");
                return;
            }

            me._cancelAjaxRequest();

            var layerIds = me._buildLayerIdList();



            /* let's not start anything we cant' resolve */
            if (!layerIds) {
                me._sandbox.printDebug("[GetInfoPlugin] NO layers with featureInfoEnabled, in scale and visible");
                return;
            }

            var filtters = me._getFilters();

            me._startAjaxRequest(dteMs);

            var ajaxUrl = this._sandbox.getAjaxUrl();

            var lon = lonlat.lon;
            var lat = lonlat.lat;

            var mapVO = me._sandbox.getMap();

            jQuery.ajax({
                beforeSend: function (x) {
                    me._pendingAjaxQuery.jqhr = x;
                    if (x && x.overrideMimeType) {
                        x.overrideMimeType("application/json;charset=UTF-8");
                    }
                },
                success: function (resp) {
                    me._closeGfiInfo();
                    var html = resp.html;
                    var title = resp.title;

                    if (title === null || title === undefined) {
                        title = '';
                    }

                    if (html !== null && html !== undefined && html !== '') {
                        var parsed = {
                            html: html,
                            title: title
                        };
                        parsed.lonlat = lonlat;
                        parsed.popupid = me.infoboxId;
                        me._showFeatures(parsed);
                    }
                    me._finishAjaxRequest();
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
                data: {
                    layerIds: layerIds,
                    projection: me.mapModule.getProjection(),
                    filtters: filtters,
                    x: x,
                    y: y,
                    lon: lon,
                    lat: lat,
                    width: mapVO.getWidth(),
                    height: mapVO.getHeight(),
                    bbox: mapVO.getBbox().toBBOX(),
                    zoom: mapVO.getZoom(),
                    lang: Oskari.getLang()
                },
                type: 'POST',
                dataType: 'json',
                url: ajaxUrl + 'action_route=GetFeatureInfoWMS'
            });
        },
        /**
         * @method _closeGfiInfo
         * @private
         * Closes the infobox with GFI data
         */
        _closeGfiInfo: function () {
            var rn = "HaravaInfoBox.HideInfoBoxRequest";
            var rb = this._sandbox.getRequestBuilder(rn);
            var r = rb(this.infoboxId);
            this._sandbox.request(this, r);
        },
        /**
         * @method _showGfiInfo
         * @private
         * Shows given content in given location using infobox bundle
         * @param {Object[]} content infobox content array
         * @param {OpenLayers.LonLat} lonlat location for the GFI data
         */
        _showGfiInfo: function (content, lonlat) {
            var me = this;
            // send out the request
            var rn = "HaravaInfoBox.ShowInfoBoxRequest";
            var rb = this._sandbox.getRequestBuilder(rn);
            var r = rb("getinforesult", "GetInfo Result", content, lonlat, true);
            this._sandbox.request(me, r);
        },
        /**
         * @method _showFeatures
         * @private
         * Shows multiple features in an infobox
         *
         * @param {Object} data
         */
        _showFeatures: function (data) {
            var me = this;
            var contentHtml = [];
            var content = {};
            content.html = data.html;
            var rn = "HaravaInfoBox.ShowInfoBoxRequest";
            var rb = me._sandbox.getRequestBuilder(rn);
            var r = rb(data.popupid, "Info", [content], data.lonlat, true);
            me._sandbox.request(me, r);
        }
    }, {
        /**
         * @property {Object} protocol
         * @static
         */
        'protocol': ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"]
    });
