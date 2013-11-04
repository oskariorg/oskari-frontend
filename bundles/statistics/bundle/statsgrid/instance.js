/**
 * @class Oskari.statistics.bundle.statsgrid.StatsGridBundleInstance
 *
 * Sample extension bundle definition which inherits most functionalty
 * from DefaultExtension class.
 *
 */
Oskari.clazz.define('Oskari.statistics.bundle.statsgrid.StatsGridBundleInstance',
    /**
     * @static constructor function
     */

    function () {
        this.conf = {
            "name": "StatsGrid",
            "sandbox": "sandbox",
            "stateful": true,
            "tileClazz": "Oskari.statistics.bundle.statsgrid.Tile",
            "viewClazz": "Oskari.statistics.bundle.statsgrid.StatsView"
        };
        this.state = {
            indicators: [],
            layerId: null
        };
    }, {
        "start": function () {
            var me = this,
                conf = this.conf,
                sandboxName = (conf ? conf.sandbox : null) || 'sandbox',
                sandbox = Oskari.getSandbox(sandboxName);

            me.sandbox = sandbox;
            sandbox.register(this);

            /* stateful */
            if (conf && conf.stateful === true) {
                sandbox.registerAsStateful(this.mediator.bundleId, this);
            }

            var request = sandbox.getRequestBuilder('userinterface.AddExtensionRequest')(this);
            sandbox.request(this, request);

            var tooltipRequestHandler = Oskari.clazz.create('Oskari.statistics.bundle.statsgrid.request.TooltipContentRequestHandler', this);
            sandbox.addRequestHandler('StatsGrid.TooltipContentRequest', tooltipRequestHandler);

            var indicatorRequestHandler = Oskari.clazz.create('Oskari.statistics.bundle.statsgrid.request.IndicatorsRequestHandler', this);
            sandbox.addRequestHandler('StatsGrid.IndicatorsRequest', indicatorRequestHandler);

            var locale = me.getLocalization(),
                mapModule = sandbox.findRegisteredModuleInstance('MainMapModule');
            this.mapModule = mapModule;

            // create the StatisticsService for handling ajax calls
            // and common functionality.
            var statsService = Oskari.clazz.create('Oskari.statistics.bundle.statsgrid.StatisticsService', me);
            sandbox.registerService(statsService);
            this.statsService = statsService;

            // Register stats plugin for map which creates
            // - the indicator selection UI (unless 'published' param in the conf is true)
            // - the grid.
            var gridConf = {
                'state': me.getState(),
                //'csvDownload' : true,
                "statistics": [{
                    "id": "avg",
                    "visible": true
                }, {
                    "id": "max",
                    "visible": true
                }, {
                    "id": "min",
                    "visible": true
                }, {
                    "id": "mde",
                    "visible": true
                }, {
                    "id": "mdn",
                    "visible": true
                }, {
                    "id": "std",
                    "visible": true
                }, {
                    "id": "sum",
                    "visible": true
                }]
            };
            var gridPlugin = Oskari.clazz.create('Oskari.statistics.bundle.statsgrid.plugin.ManageStatsPlugin', gridConf, locale);
            mapModule.registerPlugin(gridPlugin);
            mapModule.startPlugin(gridPlugin);
            this.gridPlugin = gridPlugin;

            // Register classification plugin for map.
            var classifyPlugin = Oskari.clazz.create('Oskari.statistics.bundle.statsgrid.plugin.ManageClassificationPlugin', conf, locale);
            mapModule.registerPlugin(classifyPlugin);
            mapModule.startPlugin(classifyPlugin);
            this.classifyPlugin = classifyPlugin;

            this.setState(this.state);
        },
        "eventHandlers": {
            /**
             * @method userinterface.ExtensionUpdatedEvent
             */
            'userinterface.ExtensionUpdatedEvent': function (event) {
                var me = this,
                    view = this.plugins['Oskari.userinterface.View'];

                if (event.getExtension().getName() !== me.getName() || !this._isLayerPresent()) {
                    // not me -> do nothing
                    return;
                }

                var isShown = event.getViewState() !== "close";
                view.prepareMode(isShown, null, true);
            },
            /**
             * @method MapStats.StatsVisualizationChangeEvent
             */
            'MapStats.StatsVisualizationChangeEvent': function (event) {
                this._afterStatsVisualizationChangeEvent(event);
            },
            /**
             * @method AfterMapMoveEvent
             */
            'AfterMapMoveEvent': function (event) {
                var view = this.plugins['Oskari.userinterface.View'];
                if (view.isVisible && view._layer) {
                    this._createPrintParams(view._layer);
                }
            },
            'AfterMapLayerRemoveEvent': function (event) {
                this._afterMapLayerRemoveEvent(event);
            },
            /**
             * @method MapLayerEvent
             * @param {Oskari.mapframework.event.common.MapLayerEvent} event
             *
             */
            'MapLayerEvent': function (event) {
                // Enable tile when stats layer is available
                var layerPresent = this._isLayerPresent(),
                    tile = this.plugins['Oskari.userinterface.Tile'];
                if (layerPresent && tile) {
                    tile.enable();
                }
            }
        },
        _isLayerPresent : function() {
            var service = this.sandbox.getService('Oskari.mapframework.service.MapLayerService');
            if(this.conf && this.conf.defaultLayerId) {
                var layer = service.findMapLayer(this.conf.defaultLayerId);
                return (layer != null && layer.isLayerOfType('STATS'));
            }
            var layers = service.getLayersOfType('STATS');
            if(layers && layers.length > 0) {
                this.conf.defaultLayerId = layers[0].getId();
                return true;
            }
            return false;
        },
        /**
         * @method setState
         * Sets the map state to one specified in the parameter. State is bundle specific, check the
         * bundle documentation for details.
         * @param {Object} state bundle state as JSON
         * @param {Boolean} ignoreLocation true to NOT set map location based on state
         */
        setState: function (state, ignoreLocation) {
            var me = this,
                view = this.plugins['Oskari.userinterface.View'],
                container = view.getEl();
            var layer = this.sandbox.findMapLayerFromAllAvailable(state.layerId);

            if (!layer) {
                return;
            }

            // We need to notify the grid of the current state so it can load the right indicators.
            me.gridPlugin.setState(state);

            // Load the mode and show content if not loaded already.
            if (!view.isVisible) {
                view.prepareMode(true, layer);
            } else {
                // Otherwise just load the indicators in the state.
                me.gridPlugin.loadStateIndicators(state, container);
            }
        },
        getState: function () {
            return this.state;
        },

        /**
         * Get state parameters.
         * Returns string with statsgrid state. State value keys are before the '-' separator and
         * the indiators are after the '-' separator. The indicators are further separated by ',' and
         * both state values and indicator values are separated by '+'.
         *
         * @method getStateParameters
         * @return {String} statsgrid state
         */
        getStateParameters: function () {
            // If the state is null or an empty object, nothing to do here!
            if (!this.state || jQuery.isEmptyObject(this.state)) {
                return null;
            }

            var i = null,
                ilen = null,
                ilast = null,
                statsgridState = "statsgrid=",
                valueSeparator = "+",
                indicatorSeparator = ",",
                stateValues = null,
                indicatorValues = null,
                colorsValues = null,
                state = this.state,
                colors = state.colors || {},
                keys = ['layerId', 'currentColumn', 'methodId', 'numberOfClasses', 'classificationMode', 'manualBreaksInput'],
                colorKeys = ['set', 'index', 'flipped'],
                indicators = state.indicators || [],
                value;

            // Note! keys needs to be handled in the backend as well.
            // Therefore the key order is important as well as actual values.
            // 'classificationMode' can be an empty string but it must be the fifth value.
            // 'manualBreaksInput' can be an empty string but it must be the sixth value.
            for (i = 0, ilen = keys.length, ilast = ilen - 1; i < ilen; i++) {
                value = state[keys[i]];
                if (value !== null && value !== undefined) {
                    // skip undefined and null
                    stateValues += value;
                }
                if (i !== ilast) {
                    stateValues += valueSeparator;
                }
            }

            // handle indicators separately
            for (i = 0, ilen = indicators.length, ilast = ilen - 1; i < ilen; i++) {
                indicatorValues += indicators[i].indicator;
                indicatorValues += valueSeparator;
                indicatorValues += indicators[i].year;
                indicatorValues += valueSeparator;
                indicatorValues += indicators[i].gender;
                if (i !== ilast) {
                    indicatorValues += indicatorSeparator;
                }
            }

            // handle colors separately
            var colorArr = [];
            colors.flipped = colors.flipped === true;
            for (i = 0, ilen = colorKeys.length; i < ilen; ++i) {
                var cKey = colorKeys[i];
                if (colors.hasOwnProperty(cKey) && colors[cKey] != null) {
                    colorArr.push(colors[cKey]);
                }
            }
            if (colorArr.length === 3) {
                colorsValues = colorArr.join(',');
            }

            var ret = null;
            if (stateValues && indicatorValues) {
                ret = statsgridState + stateValues + "-" + indicatorValues;
                if (colorsValues) ret += "-" + colorsValues;
            }

            return ret;
        },

        getView: function () {
            return this.plugins['Oskari.userinterface.View'];
        },

        /**
         * Gets the instance sandbox.
         *
         * @method getSandbox
         * @return {Object} return the sandbox associated with this instance
         */
        getSandbox: function() {
            return this.sandbox;
        },

        /**
         * Returns the open indicators of the instance's grid plugin.
         *
         * @method getGridIndicators
         * @return {Object/null} returns the open indicators of the grid plugin, or null if no grid plugin
         */
        getGridIndicators: function() {
            return ( this.gridPlugin ? this.gridPlugin.indicatorsMeta : null );
        },

        /**
         * Creates parameters for printout bundle and sends an event to it.
         * Params include the BBOX and the image url of the layer with current
         * visualization parameters.
         *
         * @method _createPrintParams
         * @private
         * @param {Object} layer
         */
        _createPrintParams: function (layer) {
            var oLayer = this.mapModule.getOLMapLayers(layer.getId())[0],
                data = [{
                    // The max extent of the layer
                    bbox: oLayer.maxExtent.toArray(),
                    // URL of the image with current viewport
                    // bounds and all the original parameters
                    url: oLayer.getURL(oLayer.getExtent())
                }],
                retainEvent,
                eventBuilder;

            // If the event is already defined, just update the data.
            if (this.printEvent) {
                retainEvent = true;
                this.printEvent.setLayer(layer);
                this.printEvent.setTileData(data);
            } else {
                // Otherwise create the event with the data.
                retainEvent = false;
                eventBuilder = this.sandbox.getEventBuilder('Printout.PrintableContentEvent');
                if (eventBuilder) {
                    this.printEvent = eventBuilder(this.getName(), layer, data);
                }
            }

            this.sandbox.notifyAll(this.printEvent, retainEvent);
        },

        /**
         * Saves params to the state and sends them to the print service as well.
         *
         * @method _afterStatsVisualizationChangeEvent
         * @private
         * @param {Object} event
         */
        _afterStatsVisualizationChangeEvent: function (event) {
            var params = event.getParams(),
                layer = event.getLayer();

            // Saving state
            this.state.methodId = params.methodId;
            this.state.numberOfClasses = params.numberOfClasses;
            this.state.manualBreaksInput = params.manualBreaksInput;
            this.state.colors = params.colors;
            this.state.classificationMode = params.classificationMode;
            // Send data to printout bundle
            this._createPrintParams(layer);
        },

        /**
         * Exits the stats mode after the stats layer gets removed.
         *
         * @method _afterMapLayerRemoveEvent
         * @private
         * @param {Object} event
         */
        _afterMapLayerRemoveEvent: function (event) {
            var layer = event.getMapLayer(),
                layerId = layer.getId(),
                view = this.plugins['Oskari.userinterface.View'];

            // Exit the mode
            if (view._layer && (layerId === view._layer.getId())) {
                view.prepareMode(false);
            }
        }
    }, {
        "extend": ["Oskari.userinterface.extension.DefaultExtension"]
    });