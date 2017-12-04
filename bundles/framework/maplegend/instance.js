/**
 * @class Oskari.mapframework.bundle.maplegend.MapLegendBundleInstance
 *
 * Main component and starting point for the "map legend" functionality.
 * Lists legends of maplayers that are currently on the map.
 * Note! Not all layers have legends.
 *
 * See Oskari.mapframework.bundle.maplegend.MapLegendBundle for bundle definition.
 */
Oskari.clazz.define("Oskari.mapframework.bundle.maplegend.MapLegendBundleInstance",

    /**
     * @method create called automatically on construction
     * @static
     */

    function () {
        this.sandbox = null;
        this.started = false;
        this.plugins = {};
        this.plugin = null;
        this.localization = null;
    }, {
        /**
         * @static
         * @property __name
         */
        __name: 'maplegend',
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
         * implements BundleInstance protocol start method
         */
        start: function () {
            var me = this;

            if (me.started) {
                return;
            }

            me.started = true;

            var conf = this.conf || {};
            var sandbox = Oskari.getSandbox(conf.sandbox || 'sandbox');
            this.setSandbox(sandbox);

            sandbox.register(me);
            Object.keys(me.eventHandlers).forEach(function(eventName) {
                sandbox.registerForEventByName(me, eventName);
            });

            if (this.isEmbedded()) {
                this.createPlugin();
            } else {
                //Let's extend UI
                var request = Oskari.requestBuilder('userinterface.AddExtensionRequest')(this);
                sandbox.request(this, request);

                // draw ui
                me.createUi();
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

            return handler.apply(this, [event]);

        },
        /**
         * @property {Object} eventHandlers
         * @static
         */
        eventHandlers: {

            /**
             * @method AfterMapLayerRemoveEvent
             *
             * Calls flyouts handleLayerSelectionChanged() method
             */
            'AfterMapLayerRemoveEvent': function () {
                this.refreshUI();
            },
            /**
             * @method AfterMapLayerAddEvent
             *
             * Calls flyouts handleLayerSelectionChanged() method
             */
            'AfterMapLayerAddEvent': function () {
               this.refreshUI();
             },
            /**
             * @method AfterChangeMapLayerStyleEvent
             */
            'AfterChangeMapLayerStyleEvent': function () {
               this.refreshUI();
             },
            'AfterRearrangeSelectedMapLayerEvent': function () {
               this.refreshUI();
            },
            /**
             * @method MapLayerEvent
             * @param {Oskari.mapframework.event.common.MapLayerEvent} event
             */
            'MapLayerEvent': function (event) {
                if (event.getOperation() === 'update') {
                    this.plugins['Oskari.userinterface.Flyout'].refresh();
                }
            }
        },

        /**
         * @method stop
         * implements BundleInstance protocol stop method
         */
        stop: function () {
            var me = this;
            var sandbox = this.sandbox();
            Object.keys(this.eventHandlers).forEach(function(eventName) {
                sandbox.unregisterFromEventByName(me, eventName);
            });

            var request = Oskari.requestBuilder('userinterface.RemoveExtensionRequest')(this);
            sandbox.request(this, request);

            this.stopPlugin();
            sandbox.unregister(this);
            this.started = false;
        },
        /**
         * @method startExtension
         * implements Oskari.userinterface.Extension protocol startExtension method
         * Creates a flyout and a tile:
         * Oskari.mapframework.bundle.maplegend.Flyout
         * Oskari.mapframework.bundle.maplegend.Tile
         */
        startExtension: function () {
            this.plugins['Oskari.userinterface.Flyout'] = Oskari.clazz.create('Oskari.mapframework.bundle.maplegend.Flyout', this);
            this.plugins['Oskari.userinterface.Tile'] = Oskari.clazz.create('Oskari.mapframework.bundle.maplegend.Tile', this);
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
        },
        isEmbedded: function() {
            return jQuery('#contentMap').hasClass('published');
        },
        refreshUI: function() {
            var uicomponent = this.isEmbedded() ? this.plugin : this.plugins['Oskari.userinterface.Flyout'];
            if(uicomponent) {
                uicomponent.refresh();
            }
        },
        /**
         * @method createUi
         * (re)creates the UI for "all layers" functionality
         */
        createUi: function () {
            this.plugins['Oskari.userinterface.Flyout'].createUi();
            this.plugins['Oskari.userinterface.Tile'].refresh();
        },
        createPlugin: function() {
          var conf = this.conf || {};

          var plugin = Oskari.clazz.create('Oskari.mapframework.bundle.maplegend.plugin.MapLegendPlugin', conf, this.plugins);

          var mapmodule = this.getSandbox().findRegisteredModuleInstance('MainMapModule');
          mapmodule.registerPlugin(plugin);
          mapmodule.startPlugin(plugin);
          this.plugin = plugin;
        },
        stopPlugin: function() {
            if(!this.plugin) {
                return;
            }
            var mapmodule = this.getSandbox().findRegisteredModuleInstance('MainMapModule');
            mapmodule.unregisterPlugin(this.plugin);
            mapmodule.stopPlugin(this.plugin);
            this.plugin = null;
        }
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        "protocol": ["Oskari.bundle.BundleInstance", 'Oskari.mapframework.module.Module', 'Oskari.userinterface.Extension']
    });
