/**
 * @class Oskari.mapframework.bundle.layerselector2.LayerSelectorBundleInstance
 *
 * Main component and starting point for the "all layers" functionality.
 * Lists all the layers available in Oskari.mapframework.service.MapLayerService and updates
 * UI if Oskari.mapframework.event.common.MapLayerEvent is received.
 *
 * See Oskari.mapframework.bundle.layerselector2.LayerSelectorBundle for bundle definition.
 */
Oskari.clazz.define(
    'Oskari.mapframework.bundle.layerselector2.LayerSelectorBundleInstance',

    /**
     * @method create called automatically on construction
     * @static
     */

    function () {
        //"use strict";
        this.sandbox = null;
        this.started = false;
        this.plugins = {};
        this.localization = null;
        this.filteredLayerListOpenedByRequest = false;
    }, {
        /**
         * @static
         * @property __name
         */
        __name: 'LayerSelector',
        /**
         * @method getName
         * @return {String} the name for the component
         */
        getName: function () {
            //"use strict";
            return this.__name;
        },
        /**
         * @method setSandbox
         * @param {Oskari.Sandbox} sandbox
         * Sets the sandbox reference to this component
         */
        setSandbox: function (sandbox) {
            //"use strict";
            this.sandbox = sandbox;
        },
        /**
         * @method getSandbox
         * @return {Oskari.Sandbox}
         */
        getSandbox: function () {
            //"use strict";
            return this.sandbox;
        },

        /**
         * @method getLocalization
         * Returns JSON presentation of bundles localization data for current language.
         * If key-parameter is not given, returns the whole localization data.
         *
         * @param {String} key (optional) if given, returns the value for key
         * @return {String/Object} returns single localization string or
         *     JSON object for complete data depending on localization
         *     structure and if parameter key is given
         */
        getLocalization: function (key) {
            //"use strict";
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
            //"use strict";
            var me = this,
                conf = me.conf,
                sandboxName = conf ? conf.sandbox : 'sandbox',
                sandbox = Oskari.getSandbox(sandboxName),
                request,
                mapLayerService,
                successCB,
                failureCB,
                p;

            if (me.started) {
                return;
            }

            me.started = true;
            me.sandbox = sandbox;

            sandbox.register(me);
            for (p in me.eventHandlers) {
                if (me.eventHandlers.hasOwnProperty(p)) {
                    sandbox.registerForEventByName(me, p);
                }
            }

            //Let's extend UI
            request = sandbox.getRequestBuilder('userinterface.AddExtensionRequest')(me);
            sandbox.request(me, request);

            // create and register request handlers
            var reqHandler = Oskari.clazz.create('Oskari.mapframework.bundle.layerselector2.request.ShowFilteredLayerListRequestHandler', sandbox, this);
            sandbox.addRequestHandler('ShowFilteredLayerListRequest', reqHandler);


            var reqHandlerAddLayerListFilter = Oskari.clazz.create('Oskari.mapframework.bundle.layerselector2.request.AddLayerListFilterRequestHandler', sandbox, this);
            sandbox.addRequestHandler('AddLayerListFilterRequest', reqHandlerAddLayerListFilter);

            // draw ui
            me.createUi();

            mapLayerService = me.sandbox.getService(
                'Oskari.mapframework.service.MapLayerService'
            );

            sandbox.registerAsStateful(me.mediator.bundleId, me);

            successCB = function () {
                // massive update so just recreate the whole ui
                //me.plugins['Oskari.userinterface.Flyout'].populateLayers();
                // added through maplayerevent
            };
            failureCB = function () {
                alert(me.getLocalization('errors').loadFailed);
            };
            mapLayerService.loadAllLayersAjax(successCB, failureCB);
        },
        /**
         * @method init
         * implements Module protocol init method - does nothing atm
         */
        init: function () {
            //"use strict";
            return null;
        },
        /**
         * @method update
         * implements BundleInstance protocol update method - does nothing atm
         */
        update: function () {
            //"use strict";
        },
        /**
         * @method onEvent
         * @param {Oskari.mapframework.event.Event} event a Oskari event object
         * Event is handled forwarded to correct #eventHandlers if found or discarded if not.
         */
        onEvent: function (event) {
            //"use strict";
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
             * @param {Oskari.mapframework.event.common.AfterMapLayerRemoveEvent} event
             *
             * Calls flyouts handleLayerSelectionChanged() method
             */
            AfterMapLayerRemoveEvent: function (event) {
                //"use strict";
                this.plugins['Oskari.userinterface.Flyout'].handleLayerSelectionChanged(event.getMapLayer(), false);
            },

            /**
             * @method AfterMapLayerAddEvent
             * @param {Oskari.mapframework.event.common.AfterMapLayerAddEvent} event
             *
             * Calls flyouts handleLayerSelectionChanged() method
             */
            AfterMapLayerAddEvent: function (event) {
                //"use strict";
                this.plugins['Oskari.userinterface.Flyout'].handleLayerSelectionChanged(event.getMapLayer(), true);
            },

            /**
             * @method MapLayerEvent
             * @param {Oskari.mapframework.event.common.MapLayerEvent} event
             */
            MapLayerEvent: function (event) {
                //"use strict";
                var me = this,
                    flyout = me.plugins['Oskari.userinterface.Flyout'],
                    tile = me.plugins['Oskari.userinterface.Tile'],
                    mapLayerService = me.sandbox.getService(
                        'Oskari.mapframework.service.MapLayerService'
                    ),
                    layerId = event.getLayerId(),
                    layer;

                flyout.clearNewestFilter();

                if (event.getOperation() === 'update') {
                    layer = mapLayerService.findMapLayer(layerId);
                    flyout.handleLayerModified(layer);
                } else if (event.getOperation() === 'add') {
                    layer = mapLayerService.findMapLayer(layerId);
                    flyout.handleLayerAdded(layer);
                    // refresh layer count
                    tile.refresh();
                } else if (event.getOperation() === 'remove') {
                    flyout.handleLayerRemoved(layerId);
                    // refresh layer count
                    tile.refresh();
                } else if (event.getOperation() === 'sticky') {
                    layer = mapLayerService.findMapLayer(layerId);
                    flyout.handleLayerSticky(layer);
                    // refresh layer count
                    tile.refresh();
                }


            },

            'BackendStatus.BackendStatusChangedEvent': function (event) {
                var layerId = event.getLayerId(),
                    status = event.getStatus(),
                    flyout = this.plugins['Oskari.userinterface.Flyout'],
                    mapLayerService = this.sandbox.getService(
                        'Oskari.mapframework.service.MapLayerService'
                    ),
                    layer;

                if (layerId === null || layerId === undefined) {
                    // Massive update so just recreate the whole ui
                    flyout.populateLayers();
                } else {
                    layer = mapLayerService.findMapLayer(layerId);
                    flyout.handleLayerModified(layer);
                }
            },

            /**
             * @method ExtensionUpdatedEvent
             */
            'userinterface.ExtensionUpdatedEvent': function (event) {
                var me = this,
                    plugin = me.plugins['Oskari.userinterface.Flyout'];

                // ExtensionUpdateEvents are fired a lot, only let layerselector2 extension event to be handled when enabled
                if (event.getExtension().getName() !== this.getName()) {
                    // wasn't me -> do nothing
                    return;
                }
                if (event.getViewState() !== 'close') {
                    plugin.focus();
                }
                // Remove the filtering, if opened by ShowFilteredLayerListRequest.
                else if(me.filteredLayerListOpenedByRequest) {
                    plugin.deactivateAllFilters();
                    plugin.setLayerListFilteringFunction(null);
                    me.filteredLayerListOpenedByRequest = false;
                }
            }
        },

        /**
         * @method stop
         * implements BundleInstance protocol stop method
         */
        stop: function () {
            //"use strict";
            var me = this,
                sandbox = me.sandbox(),
                request,
                p;

            for (p in me.eventHandlers) {
                if (me.eventHandlers.hasOwnProperty(p)) {
                    sandbox.unregisterFromEventByName(me, p);
                }
            }

            request = sandbox.getRequestBuilder('userinterface.RemoveExtensionRequest')(this);

            sandbox.request(me, request);

            me.sandbox.unregisterStateful(me.mediator.bundleId);
            me.sandbox.unregister(me);
            me.started = false;
        },
        /**
         * @method startExtension
         * implements Oskari.userinterface.Extension protocol startExtension method
         * Creates a flyout and a tile:
         * Oskari.mapframework.bundle.layerselector2.Flyout
         * Oskari.mapframework.bundle.layerselector2.Tile
         */
        startExtension: function () {
            //"use strict";
            this.plugins['Oskari.userinterface.Flyout'] = Oskari.clazz.create(
                'Oskari.mapframework.bundle.layerselector2.Flyout',
                this
            );
            this.plugins['Oskari.userinterface.Tile'] = Oskari.clazz.create(
                'Oskari.mapframework.bundle.layerselector2.Tile',
                this
            );
        },
        /**
         * @method stopExtension
         * implements Oskari.userinterface.Extension protocol stopExtension method
         * Clears references to flyout and tile
         */
        stopExtension: function () {
            //"use strict";
            this.plugins['Oskari.userinterface.Flyout'] = null;
            this.plugins['Oskari.userinterface.Tile'] = null;
        },
        /**
         * @method getPlugins
         * implements Oskari.userinterface.Extension protocol getPlugins method
         * @return {Object} references to flyout and tile
         */
        getPlugins: function () {
            //"use strict";
            return this.plugins;
        },
        /**
         * @method getTitle
         * @return {String} localized text for the title of the component
         */
        getTitle: function () {
            //"use strict";
            return this.getLocalization('title');
        },
        /**
         * @method getDescription
         * @return {String} localized text for the description of the component
         */
        getDescription: function () {
            //"use strict";
            return this.getLocalization('desc');
        },
        /**
         * @method createUi
         * (re)creates the UI for "all layers" functionality
         */
        createUi: function () {
            //"use strict";
            var me = this;
            me.plugins['Oskari.userinterface.Flyout'].createUi();
            me.plugins['Oskari.userinterface.Tile'].refresh();
        },

        /**
         * @method setState
         * @param {Object} state bundle state as JSON
         */
        setState: function (state) {
            //"use strict";
            this.plugins['Oskari.userinterface.Flyout'].setContentState(state);
        },

        /**
         * @method getState
         * @return {Object} bundle state as JSON
         */
        getState: function () {
            //"use strict";
            return this.plugins['Oskari.userinterface.Flyout'].getContentState();
        }
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        protocol: [
            'Oskari.bundle.BundleInstance',
            'Oskari.mapframework.module.Module',
            'Oskari.userinterface.Extension'
        ]
    }
);