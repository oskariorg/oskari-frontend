/**
* @class Oskari.mapframework.bundle.selected-featuredata.SelectedFeatureDataBundleInstance
*
* Oskari.mapframework.bundle.selected-featuredata.SelectedFeatureDataBundleInstance.
*/
Oskari.clazz.define("Oskari.mapframework.bundle.selected-featuredata.SelectedFeatureDataBundleInstance",

    /**
     * @method create called automatically on construction
     * @static
     */
    function () {
        this.sandbox = null;
        this.started = false;
        this.plugins = {};
        this.requestHandlers = null;
        this._localization = null;
    }, {
        /**
         * @static
         * @property __name
         */
        __name: 'SelectedFeatureDataBundle',
        /**
         * @method getName
         * @return {String} the name for the component
         */
        getName: function () {
            return this.__name;
        },
        /**
         * @method setSandbox
         * @param {Oskari.Sandbox} sandbox
         * Sets the sandbox reference to this component
         */
        setSandbox: function (sandbox) {
            this.sandbox = sandbox;
        },
        /**
         * @method getSandbox
         * @return {Oskari.Sandbox}
         */
        getSandbox: function () {
            return this.sandbox;
        },
        /**
         * @method getLocalization
         * Returns JSON presentation of bundles localization data for current language.
         * If key-parameter is not given, returns the whole localization data.
         *
         * @param {String} key (optional) if given, returns the value for key
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
         * @method start
         * implements BundleInstance protocol start methdod
         */
        start: function () {
            if (this.started) {
                return;
            }

            var me = this,
                conf = me.conf,
                sandboxName = conf ? conf.sandbox : 'sandbox',
                sandbox = Oskari.getSandbox(sandboxName),
                p;

            me.started = true;
            me.sandbox = sandbox;

            this._localization = Oskari.getLocalization(this.getName());

            sandbox.register(me);
            for (p in me.eventHandlers) {
                if (me.eventHandlers.hasOwnProperty(p)) {
                    sandbox.registerForEventByName(me, p);
                }
            }

		 	var request = sandbox.getRequestBuilder('userinterface.AddExtensionRequest')(me);
                sandbox.request(me, request);

            var reqGetInfoResultHandler = sandbox.getRequestBuilder('GetInfoPlugin.ResultHandlerRequest')(function(content, data, formatters, params) {
                me.resultHandler(content, data, formatters, params);
            });
            sandbox.request(me, reqGetInfoResultHandler);

        },
        /**
         * [resultHandler handles requests from infobox when "Go big" is pressed]
         * @param  {[Object]} content    [content html]
         * @param  {[Object]} data       [data map]
         * @param  {[Object]} formatters [formatters]
         * @param  {[Object]} params     [params]
         */
        resultHandler: function(content, data, formatters, params){
            // show infobox
            var me = this;

            var flyout = me.plugins['Oskari.userinterface.Flyout'];

            var options = {
                hidePrevious: false,
                colourScheme: params.colourScheme,
                font: params.font
            };

            if(flyout.isFlyoutVisible() && content.length > 0){
                flyout.createUI(content, data);
            } else {
                var reqBuilder = this.getSandbox().getRequestBuilder('InfoBox.ShowInfoBoxRequest'),
                    request;

                if (reqBuilder) {
                    request = reqBuilder(
                    params.infoboxId,
                    params.title,
                    content,
                    data.lonlat,
                    options
                );

                var def = {
                    name : 'selected-featuredata-btn',
                    iconCls: 'icon-selected-featuredata',
                    tooltip: '',
                    styles: '',
                    params: {
                        content: content,
                        data:data,
                        formatters:formatters,
                        params:params
                    },
                    callback : function(params) {
                        flyout.createUI(params.content, params.data);
                        Oskari.getSandbox().requestByName(me, 'userinterface.UpdateExtensionRequest', [me, 'detach']);
                    }
                };

                    request.addAdditionalTool(def);
                    this.getSandbox().request(this, request);
                }
            }
        },
        /**
         * @method init
         * implements Module protocol init method - does nothing atm
         */
        init: function () {
            return null;
        },
        /**
         * @method update
         * implements BundleInstance protocol update method - does nothing atm
         */
        update: function () {

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

            handler.apply(this, [event]);

        },
        /**
         * @property {Object} eventHandlers
         * @static
         */
        eventHandlers: {
            /**
             * @method userinterface.ExtensionUpdatedEvent
             * Fetch when flyout is opened
             */
            'userinterface.ExtensionUpdatedEvent': function (event) {
                var me = this,
                    doOpen = event.getViewState() !== 'close',
                    p;
                if (event.getExtension().getName() !== me.getName()) {
                    // not me -> do nothing
                    return;
                }
                if (event.getViewState() === 'close') {
                     this.plugins['Oskari.userinterface.Flyout'].clearFlyout();
                }
                if (doOpen) {
                    // flyouts eventHandlers are registered
                    for (p in this.plugins['Oskari.userinterface.Flyout'].getEventHandlers()) {
                        if (!this.eventHandlers[p]) {
                            this.sandbox.registerForEventByName(this, p);
                        }
                    }
                }
            },
            'MapClickedEvent': function (){
                //if show many or one accordions is clicked
                if(jQuery('.selected_featuredata_howmany_show').attr("data-many") === "one"){
                    this.plugins['Oskari.userinterface.Flyout'].clearTabsLayout();
                }
            },
            'AfterMapLayerRemoveEvent': function(event) {
                //get layer that was removed from layers
                var layer = event.getMapLayer(),
                layerId = layer.getId();
                this.plugins['Oskari.userinterface.Flyout'].layerRemovedOrAddedFromMapMergeTabs(layerId, true);
            },
            'AfterMapLayerAddEvent': function(event) {
                //get layer that was added to layers
                var layer = event.getMapLayer(),
                layerId = layer.getId();
                this.plugins['Oskari.userinterface.Flyout'].layerRemovedOrAddedFromMapMergeTabs(layerId, false);
            }
        },

        /**
         * @method stop
         * implements BundleInstance protocol stop method
         */
        stop: function () {
            var sandbox = this.sandbox,
                p,
                request;
            for (p in this.eventHandlers) {
                if (this.eventHandlers.hasOwnProperty(p)) {
                    sandbox.unregisterFromEventByName(this, p);
                }
            }

            request = sandbox.getRequestBuilder('userinterface.RemoveExtensionRequest')(this);
            sandbox.request(this, request);


            this.sandbox.unregister(this);
            this.started = false;
        },
        /**
         * @method startExtension
         * implements Oskari.userinterface.Extension protocol startExtension method
         * Creates a flyout and a tile:
         * Oskari.mapframework.bundle.selected-featuredata.Flyout
         * Oskari.mapframework.bundle.selected-featuredata.Tile
         */
        startExtension: function () {
          	this.plugins['Oskari.userinterface.Flyout'] = Oskari.clazz.create('Oskari.mapframework.bundle.selected-featuredata.Flyout', this);
        },
        /**
         * @method stopExtension
         * implements Oskari.userinterface.Extension protocol stopExtension method
         * Clears references to flyout and tile
         */
        stopExtension: function () {
            this.plugins['Oskari.userinterface.Flyout'] = null;
            this.plugins['Oskari.userinterface.Tile'] = null;
        },
        /**
         * @method getPlugins
         * implements Oskari.userinterface.Extension protocol getPlugins method
         * @return {Object} references to flyout and tile
         */
        getPlugins: function () {
            return this.plugins;
        },
        /**
         * @method getTitle
         * @return {String} localized text for the title of the component
         */
        getTitle: function () {
            return this.getLocalization('title');
        },
        /**
         * @method getDescription
         * @return {String} localized text for the description of the component
         */
        getDescription: function () {
            return this.getLocalization('desc');
        }

    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        protocol: ['Oskari.bundle.BundleInstance', 'Oskari.mapframework.module.Module', 'Oskari.userinterface.Extension']
    });
