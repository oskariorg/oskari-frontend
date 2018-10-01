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
        this.conf = {};
        this.__loadingStatus = {};
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
         * @param {Oskari.Sandbox} sandbox
         * Sets the sandbox reference to this component
         */
        setSandbox: function(sandbox) {
            this.sandbox = sandbox;
        },

        /**
         * @method getSandbox
         * @return {Oskari.Sandbox}
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
            if (this.started) {
                return;
            }

            var me = this,
                sandboxName = (this.conf ? this.conf.sandbox : null) || 'sandbox',
                sandbox = Oskari.getSandbox(sandboxName),
                p,
                localization,
                layers = sandbox.findAllSelectedMapLayers(),
                i;

            me.started = true;
            me.sandbox = sandbox;

            this.localization = Oskari.getLocalization(this.getName());
            sandbox.register(me);

            for (p in me.eventHandlers) {
                if (me.eventHandlers.hasOwnProperty(p)) {
                    sandbox.registerForEventByName(me, p);
                }
            }

            //Let's extend UI
            var requestBuilder = sandbox.getRequestBuilder('userinterface.AddExtensionRequest');
            if (requestBuilder) {
                var request = requestBuilder(this);
                sandbox.request(this, request);
            }

            // draw ui
            me.createUi();

            localization = this.getLocalization('selectionTools');

            //sends request via config to add tool selection button
            if (this.conf && this.conf.selectionTools === true) {
                this.popupHandler = Oskari.clazz.create('Oskari.mapframework.bundle.featuredata2.PopupHandler', this);
                var addBtnRequestBuilder = sandbox.getRequestBuilder('Toolbar.AddToolButtonRequest'),
                    btn = {
                        iconCls: 'tool-feature-selection',
                        tooltip: localization.tools.select.tooltip,
                        sticky: false,
                        callback: function() {
                            me.popupHandler.showSelectionTools();
                        }
                    };
                sandbox.request(this, addBtnRequestBuilder('dialog', 'selectiontools', btn));

                this.selectionPlugin = this.sandbox.findRegisteredModuleInstance("MainMapModuleMapSelectionPlugin");

                if (!this.selectionPlugin) {
                    var config = {
                        id: "FeatureData"
                    };
                    this.selectionPlugin = Oskari.clazz.create('Oskari.mapframework.bundle.featuredata2.plugin.MapSelectionPlugin', config, this.sandbox);
                    mapModule.registerPlugin(this.selectionPlugin);
                    mapModule.startPlugin(this.selectionPlugin);
                }
            }

            // check if preselected layers included wfs layers -> act if they are added now
            for (i = 0; i < layers.length; ++i) {
                if (layers[i].hasFeatureData()) {
                    this.plugin.refresh();
                    this.plugins['Oskari.userinterface.Flyout'].layerAdded(layers[i]);
                }
            }

            sandbox.requestHandler('ShowFeatureDataRequest', this.requestHandlers.showFeatureHandler);
            this.__setupLayerTools();
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
            if (!handler) {
                return;
            }

            return handler.apply(this, [event]);
        },
        /**
         * Fetches reference to the map layer service
         * @return {Oskari.mapframework.service.MapLayerService}
         */
        getLayerService: function() {
            return this.sandbox.getService('Oskari.mapframework.service.MapLayerService');
        },

        /**
         * Adds the Feature data tool for layer
         * @param  {String| Number} layerId layer to process
         * @param  {Boolean} suppressEvent true to not send event about updated layer (optional)
         */
        __addTool: function(layerModel, suppressEvent) {
            var me = this;
            var service = this.getLayerService();
            if (typeof layerModel !== 'object') {
                // detect layerId and replace with the corresponding layerModel
                layerModel = service.findMapLayer(layerModel);
            }
            if (!layerModel || !layerModel.hasFeatureData()) {
                return;
            }

            // add feature data tool for layer
            var layerLoc = this.getLocalization('layer') || {},
                label = layerLoc['object-data'] || 'Feature data',
                tool = Oskari.clazz.create('Oskari.mapframework.domain.Tool');
            tool.setName('objectData');
            tool.setIconCls('show-featuredata-tool');
            tool.setTitle(label);
            tool.setTooltip(label);
            tool.setCallback(function() {
                me.sandbox.postRequestByName('ShowFeatureDataRequest', [layerModel.getId()]);
            });

            service.addToolForLayer(layerModel, tool, suppressEvent);
        },
        /**
         * Adds tools for all layers
         */
        __setupLayerTools: function() {
            var me = this;
            // add tools for feature data layers
            var service = this.getLayerService();
            var layers = service.getAllLayers();
            _.each(layers, function(layer) {
                me.__addTool(layer, true);
            });
            // update all layers at once since we suppressed individual events
            var event = me.sandbox.getEventBuilder('MapLayerEvent')(null, 'tool');
            me.sandbox.notifyAll(event);
        },

        /**
         * @property {Object} eventHandlers
         * @static
         */
        eventHandlers: {
            'WFSStatusChangedEvent': function(event) {
                if (event.getLayerId() === undefined) {
                    return;
                }
                var layer = this.sandbox.findMapLayerFromSelectedMapLayers(event.getLayerId());
                if (!this.__loadingStatus) {
                    this.__loadingStatus = {};
                }
                if (event.getStatus() === event.status.loading) {
                    this.__loadingStatus['' + event.getLayerId()] = 'loading';
                    this.plugin.showLoadingIndicator(true);
                    this.plugins['Oskari.userinterface.Flyout'].showLoadingIndicator(event.getLayerId(), true);
                    this.plugins['Oskari.userinterface.Flyout'].showErrorIndicator(event.getLayerId(), false);
                }

                if (event.getStatus() === event.status.complete) {
                    delete this.__loadingStatus['' + event.getLayerId()];
                    this.plugins['Oskari.userinterface.Flyout'].showLoadingIndicator(event.getLayerId(), false);
                    this.plugins['Oskari.userinterface.Flyout'].showErrorIndicator(event.getLayerId(), false);

                    if (layer && layer.isManualRefresh()) {
                        if (event.getNop()) {
                            this.plugins['Oskari.userinterface.Flyout'].setGridOpacity(layer, 0.5);
                        } else if (event.getRequestType() === event.type.image && layer._activeFeatures.length === 0) {
                            this.plugins['Oskari.userinterface.Flyout'].setGridOpacity(layer, 0.5);
                        }
                    }
                }
                if (event.getStatus() === event.status.error) {
                    this.__loadingStatus['' + event.getLayerId()] = 'error';
                    this.plugins['Oskari.userinterface.Flyout'].showLoadingIndicator(event.getLayerId(), false);
                    this.plugins['Oskari.userinterface.Flyout'].showErrorIndicator(event.getLayerId(), true);
                }
                var status = {
                    loading: [],
                    error: []
                };
                _.each(this.__loadingStatus, function(value, key) {
                    status[value].push(key);
                });
                if (status.loading.length === 0) {
                    // no layers in loading state
                    this.plugin.showLoadingIndicator(false);
                }
                // setup error indicator based on error statuses
                this.plugin.showErrorIndicator(status.error.length > 0);
            },
            'MapLayerEvent': function(event) {
                if (event.getOperation() !== 'add') {
                    // only handle add layer
                    return;
                }

                if (event.getLayerId()) {
                    this.__addTool(event.getLayerId());
                } else {
                    // ajax call for all layers
                    this.__setupLayerTools();
                }
            },
            /**
             * @method AfterMapLayerRemoveEvent
             * @param {Oskari.mapframework.event.common.AfterMapLayerRemoveEvent} event
             *
             * Calls flyouts layerRemoved() method
             */
            'AfterMapLayerRemoveEvent': function(event) {
                if (event.getMapLayer().hasFeatureData()) {
                    this.plugin.refresh();
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
                    this.plugin.refresh();
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
                var layer = event.getMapLayer();
                this.plugins['Oskari.userinterface.Flyout'].featureSelected(layer);
            },

            /**
             * @method userinterface.ExtensionUpdatedEvent
             * Disable grid updates on close, otherwise enable updates
             */
            'userinterface.ExtensionUpdatedEvent': function(event) {
                var plugin = this.plugins['Oskari.userinterface.Flyout'];

                // ExtensionUpdateEvents are fired a lot, only let featuredata2 extension event to be handled when enabled
                if (event.getExtension().getName() !== this.getName()) {
                    // wasn't me or disabled -> do nothing
                    return;
                } else if (event.getViewState() === "close") {
                    plugin.setEnabled(false);
                    if (this.plugin) {
                        this.plugin.handleCloseFlyout();
                    }
                } else {
                    plugin.setEnabled(true, true);
                }
            },

            /**
             * @method FeatureData.FinishedDrawingEvent
             */
            'FeatureData.FinishedDrawingEvent': function() {
                var me = this;

                if (!me.selectionPlugin) {
                    me.selectionPlugin = me.sandbox.findRegisteredModuleInstance('MainMapModuleMapSelectionPlugin');
                }

                var features = me.selectionPlugin.getFeaturesAsGeoJSON();

                me.selectionPlugin.clearDrawing();

                var evt = me.sandbox.getEventBuilder("WFSSetFilter")(features);
                me.sandbox.notifyAll(evt);

            },
            'DrawingEvent': function(evt) {
                var me = this;
                if (!evt.getIsFinished()) {
                    // only interested in finished drawings
                    return;
                }

                if (!me.selectionPlugin) {
                    me.selectionPlugin = me.sandbox.findRegisteredModuleInstance('MainMapModuleMapSelectionPlugin');
                }
                // published maps won't have selection plugin always
                if (!me.selectionPlugin || me.selectionPlugin.DRAW_REQUEST_ID !== evt.getId()) {
                    // event is from some other functionality
                    return;
                }
                var geojson = evt.getGeoJson();
                var pixelTolerance = 15;
                if (geojson.features.length > 0) {
                    geojson.features[0].properties.buffer_radius = me.selectionPlugin.getMapModule().getResolution() * pixelTolerance;
                } else {
                    //no features
                    return;
                }

                me.selectionPlugin.setFeatures(geojson.features);
                me.selectionPlugin.stopDrawing();

                var event = me.sandbox.getEventBuilder("WFSSetFilter")(geojson);
                me.sandbox.notifyAll(event);

                me.popupHandler.removeButtonSelection();
            },
            'AfterMapMoveEvent': function() {
                var me = this;
                me.plugin.mapStatusChanged();
                this.plugins['Oskari.userinterface.Flyout'].locateOnMapFID = null;
            },

            WFSFeatureGeometriesEvent: null
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
            this.plugins['Oskari.userinterface.Flyout'].createUi();
            var mapModule = this.sandbox.findRegisteredModuleInstance('MainMapModule'),
                plugin = Oskari.clazz.create('Oskari.mapframework.bundle.featuredata2.plugin.FeaturedataPlugin', {
                    instance: this
                });
            mapModule.registerPlugin(plugin);
            mapModule.startPlugin(plugin);
            this.plugin = plugin;

            //get the plugin order straight in mobile toolbar even for the tools coming in late
            if (Oskari.util.isMobile()) {
                mapModule.redrawPluginUIs(true);
            }

            this.mapModule = mapModule;
        }
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        "protocol": ["Oskari.bundle.BundleInstance", 'Oskari.mapframework.module.Module', 'Oskari.userinterface.Extension']
    });