/**
 * @class Oskari.mapframework.bundle.geometryeditor.GeometryEditorBundleInstance
 *
 * Main component and starting point for the "geometryeditor" functionality.
 *
 * See Oskari.mapframework.bundle.geometryeditor.GeometryEditorBundle for bundle definition.
 *
 */
Oskari.clazz.define("Oskari.mapframework.bundle.geometryeditor.GeometryEditorBundleInstance",

    /**
     * @method create called automatically on construction
     * @static
     */
    function() {
        this.sandbox = null;
        this.started = false;
        this.plugins = {};
        this.localization = null;
        this.geometryEditorService = null;
    }, {
        /**
         * @static
         * @property __name
         */
        __name: 'GeometryEditor',

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

            if (me.started) {
                return;
            }

            me.started = true;

            var sandboxName = (this.conf ? this.conf.sandbox : null) || 'sandbox';
            var sandbox = Oskari.getSandbox(sandboxName);

            me.sandbox = sandbox;

            this.localization = Oskari.getLocalization(this.getName());

            sandbox.register(me);
            for (var p in me.eventHandlers) {
                sandbox.registerForEventByName(me, p);
            }

            this.geometryEditorService = Oskari.clazz.create('Oskari.mapframework.bundle.geometryeditor.service.GeometryEditorService', me);
            sandbox.registerService(this.geometryEditorService);

            this.geometryEditorService.createGeometryEditorLayer();
        },

        /**
         * @method init
         * implements Module protocol init method - does nothing atm
         */
        "init": function() {
            var me = this;
            this.requestHandlers = {
//                showFeatureHandler: Oskari.clazz.create('Oskari.mapframework.bundle.featuredata2.request.ShowFeatureDataRequestHandler', me)
            };
            return null;
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
/*            'AfterMapLayerRemoveEvent': function(event) {
                if (event.getMapLayer().hasFeatureData()) {
                    this.plugin.update();
                    this.plugins['Oskari.userinterface.Flyout'].layerRemoved(event.getMapLayer());
                }
            }
*/
        },

        /**
         * @method stop
         * implements BundleInstance protocol stop method
         */
        "stop": function() {
            var sandbox = this.sandbox(),
                p;
            for (p in this.eventHandlers) {
                if (this.eventHandlers.hasOwnProperty(p)) {
                    sandbox.unregisterFromEventByName(this, p);
                }
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

        },

        /**
         * @method stopExtension
         * implements Oskari.userinterface.Extension protocol stopExtension method
         * Clears references to flyout and tile
         */
        stopExtension: function() {
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
/*            var me = this;
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
*/
        }
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        "protocol": ["Oskari.bundle.BundleInstance", 'Oskari.mapframework.module.Module', 'Oskari.userinterface.Extension']
    });
