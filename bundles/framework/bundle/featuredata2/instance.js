/**
 * @class Oskari.mapframework.bundle.featuredata2.FeatureDataBundleInstance
 *
 * Main component and starting point for the "featuredata2" functionality.
 *
 * See Oskari.mapframework.bundle.featuredata2.FeatureDataBundle for bundle definition.
 *
 */
Oskari.clazz.define("Oskari.mapframework.bundle.featuredata2.FeatureDataBundleInstance",

/**
 * @method create called automatically on construction
 * @static
 */
function() {
    this.sandbox = null;
    this.started = false;
    this.plugins = {};
    this.localization = null;
    this.popupHandler = null;
    this.selectionPlugin = null;
}, {
    /**
     * @static
     * @property __name
     */
    __name: 'FeatureData2',

    /**
     * @method getName
     * @return {String} the name for the component
     */
    "getName": function() {
        return this.__name;
    },

    /**
     * @method setSandbox
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     * Sets the sandbox reference to this component
     */
    setSandbox: function(sandbox) {
        this.sandbox = sandbox;
    },

    /**
     * @method getSandbox
     * @return {Oskari.mapframework.sandbox.Sandbox}
     */
    getSandbox: function() {
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
    getLocalization: function(key) {
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
    "start": function() {
        var me = this;

        if (me.started) return;

        me.started = true;

        var sandboxName = (this.conf ? this.conf.sandbox : null) || 'sandbox';
        var sandbox = Oskari.getSandbox(sandboxName);

        me.sandbox = sandbox;

        this.localization = Oskari.getLocalization(this.getName());

        sandbox.register(me);
        for (var p in me.eventHandlers) {
            sandbox.registerForEventByName(me, p);
        }

        //Let's extend UI
        var request = sandbox.getRequestBuilder('userinterface.AddExtensionRequest')(this);
        sandbox.request(this, request);

        // draw ui
        me.createUi();

        var localization = this.getLocalization('popup');

        //sends request via config to add tool selection button
        if (this.conf && this.conf.selectionTools === true) {
            this.popupHandler = Oskari.clazz.create('Oskari.mapframework.bundle.featuredata2.PopupHandler', this);
            var addBtnRequestBuilder = sandbox.getRequestBuilder('Toolbar.AddToolButtonRequest');
            var btn = {
                iconCls: 'tool-feature-selection',
                tooltip: localization.tools.select.tooltip,
                sticky: false,
                callback: function() {
                    me.popupHandler.showSelectionTools(me.conf.singleSelection);
                }
            };

            sandbox.request(this, addBtnRequestBuilder('dialog', 'selectiontools', btn));
        }

        // check if preselected layers included wfs layers -> act if they are added now
        var layers = sandbox.findAllSelectedMapLayers();
        for (var i = 0; i < layers.length; ++i) {
            if (layers[i].hasFeatureData()) {
                this.plugin.update();
                this.plugins['Oskari.userinterface.Flyout'].layerAdded(layers[i]);
            }
        }

        sandbox.addRequestHandler('ShowFeatureDataRequest', this.requestHandlers.showFeatureHandler);
    },

    /**
     * @method init
     * implements Module protocol init method - does nothing atm
     */
    "init": function() {
        var me = this;
        this.requestHandlers = {
            showFeatureHandler: Oskari.clazz.create('Oskari.mapframework.bundle.featuredata2.request.ShowFeatureDataRequestHandler', me)
        };
        return null;
    },

    /**
     * @method getSelectionPlugin
     * @return {Oskari.mapframework.bundle.metadata.plugin.MapSelectionPlugin}
     **/
    getSelectionPlugin: function() {
        return this.selectionPlugin;
    },

    /**
     * @method update
     * implements BundleInstance protocol update method - does nothing atm
     */
    "update": function() {

    },

    /**
     * @method onEvent
     * @param {Oskari.mapframework.event.Event} event a Oskari event object
     * Event is handled forwarded to correct #eventHandlers if found or discarded if not.
     */
    onEvent: function(event) {

        var handler = this.eventHandlers[event.getName()];
        if (!handler) return;

        return handler.apply(this, [event]);

    },

    /**
     * @property {Object} eventHandlers
     * @static
     */
    eventHandlers: {
        /**
         * @method AfterMapLayerRemoveEvent
         * @param {Oskari.mapframework.event.common.AfterMapLayerRemoveEvent} event
         *
         * Calls flyouts layerRemoved() method
         */
        'AfterMapLayerRemoveEvent': function(event) {
            if (event.getMapLayer().hasFeatureData()) {
                this.plugin.update();
                this.plugins['Oskari.userinterface.Flyout'].layerRemoved(event.getMapLayer());
            }
        },

        /**
         * @method AfterMapLayerAddEvent
         * @param {Oskari.mapframework.event.common.AfterMapLayerAddEvent} event
         *
         * Calls flyouts layerAdded() method
         */
        'AfterMapLayerAddEvent': function(event) {
            if (event.getMapLayer().hasFeatureData()) {
                this.plugin.update();
                this.plugins['Oskari.userinterface.Flyout'].layerAdded(event.getMapLayer());
            }
        },

        /**
         * @method WFSPropertiesEvent
         * Update grid headers
         */
        'WFSPropertiesEvent': function(event) {
            // update grid information [don't update the grid if not active]
            var layer = event.getLayer();
            this.plugins['Oskari.userinterface.Flyout'].updateData(layer);
        },

        /**
         * @method WFSFeatureEvent
         * Update grid data
         */
        'WFSFeatureEvent': function(event) {
            // update grid information [don't update the grid if not active]
            var layer = event.getLayer();
            this.plugins['Oskari.userinterface.Flyout'].updateData(layer);
        },

        /**
         * @method WFSFeaturesSelectedEvent
         * Highlight the feature on flyout
         */
        'WFSFeaturesSelectedEvent': function(event) {
            this.plugins['Oskari.userinterface.Flyout'].featureSelected(event);
        },

        /**
         * @method userinterface.ExtensionUpdatedEvent
         * Disable grid updates on close, otherwise enable updates
         */
        'userinterface.ExtensionUpdatedEvent': function(event) {
            var plugin = this.plugins['Oskari.userinterface.Flyout']

            // ExtensionUpdateEvents are fired a lot, only let featuredata2 extension event to be handled when enabled
            if (event.getExtension().getName() !== this.getName()) {
                // wasn't me or disabled -> do nothing
                return;
            } else if (event.getViewState() === "close") {
                plugin.setEnabled(false);
            } else {
                plugin.setEnabled(true);
            }
        },

        /**
         * @method FeatureData.FinishedDrawingEvent
         */
        'FeatureData.FinishedDrawingEvent': function(event) {
            if(!this.conf.singleSelection) {
                return;
            }

            var features = this.selectionPlugin.getFeaturesAsGeoJSON();
            this.selectionPlugin.stopDrawing();

            this.popupHandler.showSelectionTools(true);

            var event = this.sandbox.getEventBuilder("WFSSetFilter")(features);
            this.sandbox.notifyAll(event);

            this.sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [this, 'detach']);
        }
    },

    /**
     * @method stop
     * implements BundleInstance protocol stop method
     */
    "stop": function() {
        var sandbox = this.sandbox();
        for (p in this.eventHandlers) {
            sandbox.unregisterFromEventByName(this, p);
        }

        var request = sandbox.getRequestBuilder('userinterface.RemoveExtensionRequest')(this);

        sandbox.request(this, request);

        this.sandbox.unregister(this);
        this.started = false;
    },

    /**
     * @method startExtension
     * implements Oskari.userinterface.Extension protocol startExtension method
     * Creates a flyout and a tile:
     * Oskari.mapframework.bundle.featuredata2.Flyout
     * Oskari.mapframework.bundle.featuredata2.Tile
     */
    startExtension: function() {
        this.plugins['Oskari.userinterface.Flyout'] = Oskari.clazz.create('Oskari.mapframework.bundle.featuredata2.Flyout', this);
    },

    /**
     * @method stopExtension
     * implements Oskari.userinterface.Extension protocol stopExtension method
     * Clears references to flyout and tile
     */
    stopExtension: function() {
        this.plugins['Oskari.userinterface.Flyout'] = null;
    },

    /**
     * @method getPlugins
     * implements Oskari.userinterface.Extension protocol getPlugins method
     * @return {Object} references to flyout and tile
     */
    getPlugins: function() {
        return this.plugins;
    },

    /**
     * @method getTitle
     * @return {String} localized text for the title of the component
     */
    getTitle: function() {
        return this.getLocalization('title');
    },

    /**
     * @method getDescription
     * @return {String} localized text for the description of the component
     */
    getDescription: function() {
        return this.getLocalization('desc');
    },

    /**
     * @method createUi
     * (re)creates the UI for "selected layers" functionality
     */
    createUi: function() {
        var me = this;
        this.plugins['Oskari.userinterface.Flyout'].createUi();

        var mapModule = this.sandbox.findRegisteredModuleInstance('MainMapModule');
        var plugin = Oskari.clazz.create('Oskari.mapframework.bundle.featuredata2.plugin.FeaturedataPlugin', {
            instance: this
        });
        mapModule.registerPlugin(plugin);
        mapModule.startPlugin(plugin);
        this.plugin = plugin;

        // used to get fullscreen selection even if selection tools are not enabled
        var config = {
            id : "FeatureData"
            //,multipart : true
        };
        this.selectionPlugin = Oskari.clazz.create('Oskari.mapframework.bundle.featuredata2.plugin.MapSelectionPlugin', config);
        mapModule.registerPlugin(this.selectionPlugin);
        mapModule.startPlugin(this.selectionPlugin);
    }
}, {
    /**
     * @property {String[]} protocol
     * @static
     */
    "protocol": ["Oskari.bundle.BundleInstance", 'Oskari.mapframework.module.Module', 'Oskari.userinterface.Extension']
});
