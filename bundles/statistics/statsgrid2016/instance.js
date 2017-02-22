/**
 * @class Oskari.statistics.statsgrid.StatsGridBundleInstance
 *
 * Sample extension bundle definition which inherits most functionalty
 * from DefaultExtension class.
 */
Oskari.clazz.define(
    'Oskari.statistics.statsgrid.StatsGridBundleInstance',
    /**
     * @static constructor function
     */
    function () {
        // these will be used for this.conf if nothing else is specified (handled by DefaultExtension)
        this.defaultConf = {
            name: 'StatsGrid',
            sandbox: 'sandbox',
            stateful: true,
            tileClazz: 'Oskari.userinterface.extension.DefaultTile',
            flyoutClazz: 'Oskari.statistics.statsgrid.Flyout'
        };
        this.visible = false;

        this.log = Oskari.log('Oskari.statistics.statsgrid.StatsGridBundleInstance');

        this._lastRenderMode = null;

        this.togglePlugin = null;
    }, {
        afterStart: function (sandbox) {
            var me = this;

            // create the StatisticsService for handling ajax calls and common functionality.
            // FIXME: panels.newSearch.selectionValues should come from server response instead of passing it here (it's datasource specific)
            var statsService = Oskari.clazz.create('Oskari.statistics.statsgrid.StatisticsService', sandbox, this.getLocalization().panels.newSearch.selectionValues);
            sandbox.registerService(statsService);
            me.statsService = statsService;

            var conf = this.getConfiguration() || {};
            statsService.addDatasource(conf.sources);
            // disable tile if we don't have anything to show or enable if we do
            this.getTile().setEnabled(this.hasData());
            // setup initial state
            this.setState();

            if(this.isEmbedded()) {
                // Start in an embedded map mode
                // Embedded map might not have the grid. If enabled show toggle buttons so user can access it
                me.showToggleButtons(conf.grid !== false, this.state.view);
                // Always show legend on map when embedded
                me.showLegendOnMap(true);
                // Classification can be disabled for embedded map
                me.enableClassification(conf.allowClassification !== false);
            }
            // Add tool for statslayers so selected layers can show a link to open the statsgrid functionality
            this.__setupLayerTools();
        },
        isEmbedded: function() {
            return jQuery('#contentMap').hasClass('published');
        },
        hasData: function () {
            return this.statsService.getDatasource().length && this.statsService.getRegionsets().length;
        },

        /**
         * Fetches reference to the map layer service
         * @return {Oskari.mapframework.service.MapLayerService}
         */
        getLayerService : function() {
            return this.getSandbox().getService('Oskari.mapframework.service.MapLayerService');
        },
        eventHandlers: {
            'StatsGrid.IndicatorEvent' : function(evt) {
                this.statsService.notifyOskariEvent(evt);
            },
            'StatsGrid.RegionsetChangedEvent' : function(evt) {
                this.statsService.notifyOskariEvent(evt);
            },
            'StatsGrid.RegionSelectedEvent' : function(evt) {
                this.statsService.notifyOskariEvent(evt);
            },
            'StatsGrid.ActiveIndicatorChangedEvent' : function(evt) {
                this.statsService.notifyOskariEvent(evt);
            },
            'StatsGrid.ClassificationChangedEvent': function(evt) {
                this.statsService.notifyOskariEvent(evt);
            },
            'StatsGrid.DatasourceEvent': function(evt) {
                this.statsService.notifyOskariEvent(evt);
            },
            'UIChangeEvent' : function() {
                // close/tear down the ui when receiving the event
                this.getSandbox().postRequestByName('userinterface.UpdateExtensionRequest', [this, 'close']);
                var flyout = this.getFlyout();
                if(flyout) {
                    var legend = this.getFlyout().getLegendFlyout();
                    if(legend) {
                        legend.hide();
                    }
                }
            },
            /**
             * @method userinterface.ExtensionUpdatedEvent
             */
            'userinterface.ExtensionUpdatedEvent': function (event) {
                if (event.getExtension().getName() !== this.getName() || !this.hasData()) {
                    // not me/no data -> do nothing
                    return;
                }
                var wasClosed = event.getViewState() === 'close';
                this.visible = !wasClosed;
                if(wasClosed){
                    return;
                }
                var renderMode = this.isEmbedded();
                // rendermode changes if we are in geoportal and open the flyout in publisher
                if(this._lastRenderMode !== renderMode) {
                    this.getFlyout().render(renderMode);
                    this._lastRenderMode = renderMode;
                }

                this.getFlyout().setGridHeaderHeight();
            },
            /**
             * @method MapLayerEvent
             * @param {Oskari.mapframework.event.common.MapLayerEvent} event
             *
             */
            MapLayerEvent: function (event) {
                // Enable tile when stats layer is available
                this.getTile().setEnabled(this.hasData());
                // setup tools for new layers
                if(event.getOperation() !== 'add')  {
                    // only handle add layer
                    return;
                }
                if(event.getLayerId()) {
                    this.__addTool(event.getLayerId());
                }
                else {
                    // ajax call for all layers
                    this.__setupLayerTools();
                }

            }
        },

        /**
         * Adds the Feature data tool for layer
         * @param  {String| Number} layerId layer to process
         * @param  {Boolean} suppressEvent true to not send event about updated layer (optional)
         */
        __addTool : function(layerModel, suppressEvent) {
            var me = this;
            var service = this.getLayerService();
            if(typeof layerModel !== 'object') {
                // detect layerId and replace with the corresponding layerModel
                layerModel = service.findMapLayer(layerModel);
            }
            if(!layerModel || !layerModel.isLayerOfType('STATS')) {
                return;
            }

            // add feature data tool for layer
            var layerLoc = this.getLocalization('layertools') || {},
                label = layerLoc.title || 'Thematic maps',
                tool = Oskari.clazz.create('Oskari.mapframework.domain.Tool');
            tool.setName("table_icon");
            tool.setTitle(label);
            tool.setTooltip(layerLoc.tooltip || label);
            tool.setCallback(function () {
                me.sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [me, 'attach']);
            });

            service.addToolForLayer(layerModel, tool, suppressEvent);
        },
        /**
         * Adds tools for all layers
         */
        __setupLayerTools : function() {
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
         * Sets the map state to one specified in the parameter. State is bundle specific, check the
         * bundle documentation for details.
         *
         * @method setState
         * @param {Object} state bundle state as JSON
         */
        setState: function (state) {
            state = state || this.state || {};
            var service = this.statsService.getStateService();
            service.reset();
            if(state.regionset) {
                service.setRegionset(state.regionset);
            }

            if(state.indicators) {
                state.indicators.forEach(function(ind) {
                    service.addIndicator(ind.ds, ind.id, ind.selections, ind.classification);
                });
            }

            if(state.active) {
                service.setActiveIndicator(state.active);
            }

            // if state says view was visible fire up the UI, otherwise close it
            var sandbox = this.getSandbox();
            var uimode = state.view ? 'attach' : 'close';
            sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [this, uimode]);
        },
        getState: function () {
            var me = this;
            var service = this.statsService.getStateService();
            var state = {
                indicators : [],
                regionset : service.getRegionset(),
                view :me.visible
            };
            service.getIndicators().forEach(function(ind) {
                state.indicators.push({
                    ds: ind.datasource,
                    id: ind.indicator,
                    selections: ind.selections,
                    classification: service.getClassificationOpts(ind.hash)
                });
            });
            var active = service.getActiveIndicator();
            if(active) {
                state.active = active.hash;
            }
            return state;
        },
        showToggleButtons: function(enabled, visible) {
            var me = this;
            var sandbox = me.getSandbox();
            var mapModule = sandbox.findRegisteredModuleInstance('MainMapModule');
            if(!enabled) {
                if(this.togglePlugin) {
                    mapModule.unregisterPlugin(me.togglePlugin);
                    mapModule.stopPlugin(me.togglePlugin);
                }
                return;
            }
            if(!this.togglePlugin) {
                this.togglePlugin = Oskari.clazz.create('Oskari.statistics.statsgrid.TogglePlugin', this.getSandbox(), this.getLocalization().published);
            }
            me.getFlyout().move(0,0);
            mapModule.registerPlugin(me.togglePlugin);
            mapModule.startPlugin(me.togglePlugin);
            me.togglePlugin.showTable(visible || me.visible);
        },
        /**
         * @method  @public showLegendOnMap Render published  legend
         */
        showLegendOnMap: function(enabled){
            var me = this;

            var config = me.getConfiguration();
            var sandbox = me.getSandbox();
            var locale = this.getLocalization();
            var mapModule = sandbox.findRegisteredModuleInstance('MainMapModule');
            if(!enabled) {
                if(me.plugin) {
                    mapModule.unregisterPlugin(me.plugin);
                    mapModule.stopPlugin(me.plugin);
                    me.plugin = null;
                }
                return;
            }

            if(!me.plugin) {
                me.plugin = Oskari.clazz.create('Oskari.statistics.statsgrid.plugin.ClassificationToolPlugin', me, config, locale, mapModule, sandbox);
            }
            mapModule.registerPlugin(me.plugin);
            mapModule.startPlugin(me.plugin);
            //get the plugin order straight in mobile toolbar even for the tools coming in late
            if (Oskari.util.isMobile() && this.plugin.hasUI()) {
                mapModule.redrawPluginUIs(true);
            }
            return;
        },

        /**
         * @method  @public enableClassification change published map classification visibility.
         * @param  {Boolean} visible visible or not
         */
        enableClassification: function(enabled) {
            if(!this.plugin) {
                return;
            }
            this.plugin.enableClassification(enabled);
        }

    }, {
        extend: ['Oskari.userinterface.extension.DefaultExtension']
    }
);
