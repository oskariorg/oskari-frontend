/**
 * @class Oskari.mapframework.bundle.layerselection2.LayerSelectionBundleInstance
 *
 * Main component and starting point for the "selected layers" functionality.
 * Lists all the layers available in Oskari.mapframework.sandbox.Sandbox.findAllSelectedMapLayers()
 * and updates UI if maplayer related events (#eventHandlers) are received.
 *
 * See Oskari.mapframework.bundle.layerselection2.LayerSelectionBundle for bundle definition.
 *
 */
Oskari.clazz.define("Oskari.mapframework.bundle.layerselection2.LayerSelectionBundleInstance",

    /**
     * @method create called automatically on construction
     * @static
     */

    function () {
        this.sandbox = null;
        this.started = false;
        this.plugins = {};
        this.localization = null;
    }, {
        /**
         * @static
         * @property __name
         */
        __name: 'LayerSelection',
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
            this.sandbox = sandbox;
        },
        /**
         * @method getSandbox
         * @return {Oskari.mapframework.sandbox.Sandbox}
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
        "start": function () {
            var me = this;

            if (me.started)
                return;

            me.started = true;

            var conf = this.conf,
                sandboxName = (conf ? conf.sandbox : null) || 'sandbox',
                sandbox = Oskari.getSandbox(sandboxName),
                p;

            me.sandbox = sandbox;

            this.localization = Oskari.getLocalization(this.getName());

            sandbox.register(me);
            for (p in me.eventHandlers) {
                if (me.eventHandlers.hasOwnProperty(p)) {
                    sandbox.registerForEventByName(me, p);
                }
            }

            //Let's extend UI
            var request = sandbox.getRequestBuilder('userinterface.AddExtensionRequest')(this);
            sandbox.request(this, request);

            //sandbox.registerAsStateful(this.mediator.bundleId, this);
            // draw ui
            me.createUi();
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
            if (!handler)
                return;

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
             * Calls flyouts handleLayerSelectionChanged() method
             */
            'AfterMapLayerRemoveEvent': function (event) {
                this.plugins['Oskari.userinterface.Tile'].refresh();
                this.plugins['Oskari.userinterface.Flyout'].handleLayerSelectionChanged(event.getMapLayer(), false);
            },
            /**
             * @method AfterMapLayerAddEvent
             * @param {Oskari.mapframework.event.common.AfterMapLayerAddEvent} event
             *
             * Calls flyouts handleLayerSelectionChanged() method
             */
            'AfterMapLayerAddEvent': function (event) {
                this.plugins['Oskari.userinterface.Tile'].refresh();
                this.plugins['Oskari.userinterface.Flyout'].handleLayerSelectionChanged(event.getMapLayer(), true, event.getKeepLayersOrder());
            },
            /**
             * @method MapLayerEvent
             * @param {Oskari.mapframework.event.common.MapLayerEvent} event
             */
            'MapLayerEvent': function (event) {
                var mapLayerService = this.sandbox.getService('Oskari.mapframework.service.MapLayerService'),
                    layerId = event.getLayerId(),
                    layer;
                if (event.getOperation() === 'update') {
                    layer = mapLayerService.findMapLayer(layerId);
                    this.plugins['Oskari.userinterface.Flyout'].handleLayerModified(layer);
                } else if (event.getOperation() === 'sticky') {
                    layer = mapLayerService.findMapLayer(layerId);
                    this.plugins['Oskari.userinterface.Flyout'].handleLayerSticky(layer);
                }
            },
            /**
             * @method MapLayerVisibilityChangedEvent
             */
            'MapLayerVisibilityChangedEvent': function (event) {
                this.plugins['Oskari.userinterface.Flyout'].handleLayerVisibilityChanged(event.getMapLayer(), event.isInScale(), event.isGeometryMatch());
            },
            /**
             * @method AfterChangeMapLayerOpacityEvent
             */
            'AfterChangeMapLayerOpacityEvent': function (event) {
                if (event._creator !== this.getName()) {
                    this.plugins['Oskari.userinterface.Flyout'].handleLayerOpacityChanged(event.getMapLayer());
                }
            },
            /**
             * @method AfterChangeMapLayerStyleEvent
             */
            'AfterChangeMapLayerStyleEvent': function (event) {
                if (event._creator !== this.getName()) {
                    this.plugins['Oskari.userinterface.Flyout'].handleLayerStyleChanged(event.getMapLayer());
                }
            },
            /**
             * @method AfterRearrangeSelectedMapLayerEvent
             * @param {Oskari.mapframework.event.common.AfterRearrangeSelectedMapLayerEvent} event
             *
             * Rearranges layers
             */
            'AfterRearrangeSelectedMapLayerEvent': function (event) {
                if (event._creator !== this.getName()) {
                    // Layer order has been changed by someone else, resort layers
                    this.plugins['Oskari.userinterface.Tile'].refresh();
                    this.plugins['Oskari.userinterface.Flyout'].handleLayerOrderChanged(event._movedMapLayer, event._fromPosition, event._toPosition);
                }
            },
            /**
             * @method userinterface.ExtensionUpdatedEvent
             * Disable preview on close, otherwise enable preview
             */
            'userinterface.ExtensionUpdatedEvent': function (event) {
                var me = this;
                if (event.getExtension().getName() !== me.getName()) {
                    // not me -> do nothing
                    return;
                }
                var doOpen = event.getViewState() !== "close";

                /* let's not redo everything we've already done */
                /*if (doOpen) {
                this.plugins['Oskari.userinterface.Flyout'].refresh();
            }*/
            }
        },

        /**
         * @method stop
         * implements BundleInstance protocol stop method
         */
        "stop": function () {
            var sandbox = this.sandbox,
                p;
            for (p in this.eventHandlers) {
                if (this.eventHandlers.hasOwnProperty(p)) {
                    sandbox.unregisterFromEventByName(this, p);
                }
            }

            var request = sandbox.getRequestBuilder('userinterface.RemoveExtensionRequest')(this);

            sandbox.request(this, request);

            //this.sandbox.unregisterStateful(this.mediator.bundleId);
            this.sandbox.unregister(this);
            this.started = false;
        },
        /**
         * @method startExtension
         * implements Oskari.userinterface.Extension protocol startExtension method
         * Creates a flyout and a tile:
         * Oskari.mapframework.bundle.layerselection2.Flyout
         * Oskari.mapframework.bundle.layerselection2.Tile
         */
        startExtension: function () {
            this.plugins['Oskari.userinterface.Flyout'] = Oskari.clazz.create('Oskari.mapframework.bundle.layerselection2.Flyout', this);
            this.plugins['Oskari.userinterface.Tile'] = Oskari.clazz.create('Oskari.mapframework.bundle.layerselection2.Tile', this);
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
        /**
         * @method createUi
         * (re)creates the UI for "selected layers" functionality
         */
        createUi: function () {
            var me = this;
            this.plugins['Oskari.userinterface.Flyout'].createUi();
            this.plugins['Oskari.userinterface.Tile'].refresh();
        }
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        "protocol": ["Oskari.bundle.BundleInstance", 'Oskari.mapframework.module.Module', 'Oskari.userinterface.Extension']
    });
