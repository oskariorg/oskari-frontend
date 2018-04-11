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
            tileClazz: 'Oskari.statistics.statsgrid.Tile',
            vectorViewer: false
        };
        this.visible = false;

        this.log = Oskari.log('Oskari.statistics.statsgrid.StatsGridBundleInstance');

        this._lastRenderMode = null;

        this.togglePlugin = null;
        this.diagramPlugin = null;
        this.classificationPlugin = null;

        this.regionsetViewer = null;
        this.flyoutManager = null;
    }, {
        afterStart: function (sandbox) {
            var me = this;
            var mapModule = sandbox.findRegisteredModuleInstance('MainMapModule');
            // create the StatisticsService for handling ajax calls and common functionality.
            // FIXME: panels.newSearch.selectionValues should come from server response instead of passing it here (it's datasource specific)
            var statsService = Oskari.clazz.create('Oskari.statistics.statsgrid.StatisticsService', sandbox, this.getLocalization().panels.newSearch.selectionValues);
            sandbox.registerService(statsService);
            me.statsService = statsService;

            var conf = this.getConfiguration() || {};

            // Check if vector is configurated
            // If it is set map modes to support also vector
            if(conf && conf.vectorViewer === true) {
                me.statsService.setMapModes(['wms','vector']);
            }
            statsService.addDatasource(conf.sources);

            // initialize flyoutmanager
            this.flyoutManager = Oskari.clazz.create('Oskari.statistics.statsgrid.FlyoutManager', this, statsService);
            this.flyoutManager.init();
            this.getTile().setupTools( this.flyoutManager );

            // disable tile if we don't have anything to show or enable if we do
            // setup initial state
            this.setState();

            this.togglePlugin = Oskari.clazz.create('Oskari.statistics.statsgrid.TogglePlugin', this.getFlyoutManager(), this.getLocalization().published );
            mapModule.registerPlugin(this.togglePlugin);
            mapModule.startPlugin(this.togglePlugin);

            if ( this.isEmbedded() ) {
                // Start in an embedded map mode
                // Classification can be disabled for embedded map
                me.createClassficationView(true);
                me.enableClassification(conf.allowClassification !== false);

                if (me.conf.transparent) {
                    me.classificationPlugin.makeTransparent(true);
                }
                //
                if( me.conf.grid ) {
                    me.togglePlugin.addTool('table');
                }
                if( me.conf.diagram ) {
                    me.togglePlugin.addTool('diagram');
                }
            }
            // Add tool for statslayers so selected layers can show a link to open the statsgrid functionality
            this.__setupLayerTools();
            // setup DataProviderInfoService group if possible (LogoPlugin)
            var dsiservice = this.getSandbox().getService('Oskari.map.DataProviderInfoService');
            if(dsiservice) {
                dsiservice.addGroup('indicators', this.getLocalization().dataProviderInfoTitle || 'Indicators');
            }

            // regionsetViewer creation need be there because of start order
            this.regionsetViewer = Oskari.clazz.create('Oskari.statistics.statsgrid.RegionsetViewer', this, sandbox, this.conf);
        },
        isEmbedded: function() {
            return jQuery('#contentMap').hasClass('published');
        },
        hasData: function () {
            return !!this.statsService.getDatasource().length;
        },

        /**
         * Fetches reference to the map layer service
         * @return {Oskari.mapframework.service.MapLayerService}
         */
        getLayerService : function() {
            return this.getSandbox().getService('Oskari.mapframework.service.MapLayerService');
        },
        getFlyoutManager: function () {
            return this.flyoutManager;
        },
        /**
         * This will trigger an update on the LogoPlugin/Datasources popup when available.
         * @param  {Number} ds         datasource id
         * @param  {String} id         indicator id
         * @param  {Object} selections Year/other possible selections
         * @param  {Boolean} wasRemoved true if the indicator was removed
         */
        notifyDataProviderInfo : function(ds, id, selections, wasRemoved) {
                var me = this;
                var service = this.getSandbox().getService('Oskari.map.DataProviderInfoService');
                if(!service) {
                    return;
                }
                var dsid = ds + '_' +id;
                if(wasRemoved) {
                    // the check if necessary if the same indicator is added more than once with different selections
                    if(!this.statsService.getStateService().isSelected(ds, id)) {
                        // if this was the last dataset for the datasource & indicator. Remove it.
                        service.removeItemFromGroup('indicators', dsid);
                    }
                    return;
                }
                // indicator added - determine UI labels
                this.statsService.getUILabels({
                    datasource : ds,
                    indicator : id,
                    selections : selections
                }, function(labels) {
                    var datasource = me.statsService.getDatasource(ds);

                    var data = {
                        'id' : dsid,
                        'name' : labels.indicator,
                        'source' : [labels.source, {
                            name : datasource.name,
                            url : datasource.info.url
                        }]
                    };
                    if(!service.addItemToGroup('indicators', data)) {
                        // if adding failed, it might because group was not registered.
                        service.addGroup('indicators', me.getLocalization().dataProviderInfoTitle || 'Indicators');
                        // Try adding again
                        service.addItemToGroup('indicators', data);
                    }
                });
        },
        eventHandlers: {
            'StatsGrid.IndicatorEvent' : function(evt) {
                this.statsService.notifyOskariEvent(evt);
                this.notifyDataProviderInfo(evt.getDatasource(),  evt.getIndicator(), evt.getSelections(), evt.isRemoved());
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
            'StatsGrid.Filter': function(evt) {
                this.statsService.notifyOskariEvent(evt);
            },
            'UIChangeEvent' : function(evt) {
                this.getSandbox().postRequestByName('userinterface.UpdateExtensionRequest', [this, 'close']);
            },
            'userinterface.ExtensionUpdatedEvent': function ( event ) {
                var me = this;
                // Not handle other extension update events
                if(event.getExtension().getName() !== me.getName()) {
                    return;
                }
                var wasClosed = event.getViewState() === 'close';
                // moving flyout around will trigger attach states on each move
                var visibilityChanged = this.visible === wasClosed;
                this.visible = !wasClosed;
                if( !visibilityChanged ) {
                    return;
                }
                if( wasClosed ) {
                    me.getTile().hideExtensions();
                    me.createClassficationView(false);
                    return;
                } else {
                    me.getTile().showExtensions();
                    if ( !me.isEmbedded() ) {
                        me.createClassficationView(true);
                    }
                }
            },
            AfterMapLayerRemoveEvent: function (event) {
                var layer = event.getMapLayer();
                if(!layer || layer.getId() !== 'STATS_LAYER') {
                    return;
                }
                var emptyState = {};
                this.setState(emptyState);
            },
            /**
             * @method MapLayerEvent
             * @param {Oskari.mapframework.event.common.MapLayerEvent} event
             *
             */
            MapLayerEvent: function (event) {
                if(!this.getTile()) {
                    return;
                }
                // Enable tile when stats layer is available
                // this.getTile().setEnabled(this.hasData());
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
            },
            FeatureEvent: function(evt) {
                this.statsService.notifyOskariEvent(evt);
            },
            AfterChangeMapLayerOpacityEvent: function (evt) {
                 this.statsService.notifyOskariEvent(evt);
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
            var layerLoc = this.getLocalization('layertools').table_icon || {},
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

            if(state.activeRegion) {
                service.toggleRegion(state.activeRegion);
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
                indicators: [],
                regionset: service.getRegionset(),
                view: me.visible
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

            var activeRegion = service.getRegion();
            if(activeRegion) {
                state.activeRegion = activeRegion;
            }
            return state;
        },
        createClassficationView: function ( enabled ) {
            var config = this.getConfiguration();
            var sandbox = this.getSandbox();
            var locale = Oskari.getMsg.bind(null, 'StatsGrid');
            var mapModule = sandbox.findRegisteredModuleInstance('MainMapModule');

            if(!enabled) {
                if(this.classificationPlugin) {
                    mapModule.unregisterPlugin(this.classificationPlugin);
                    mapModule.stopPlugin(this.classificationPlugin);
                    this.classificationPlugin = null;
                }
                return;
            }
            this.classificationPlugin = Oskari.clazz.create('Oskari.statistics.statsgrid.ClassificationPlugin', this, config, locale, sandbox);
            mapModule.registerPlugin(this.classificationPlugin);
            mapModule.startPlugin(this.classificationPlugin);
            //get the plugin order straight in mobile toolbar even for the tools coming in late
            if (Oskari.util.isMobile() && this.classificationPlugin.hasUI()) {
                mapModule.redrawPluginUIs(true);
            }
            return;
        },
        /**
         * @method  @public enableClassification change published map classification visibility.
         * @param  {Boolean} enabled allow user to change classification or not
         */
        enableClassification: function(enabled) {
            if(!this.classificationPlugin) {
                return;
            }
            this.classificationPlugin.enableClassification(enabled);
        }

    }, {
        extend: ['Oskari.userinterface.extension.DefaultExtension']
    }
);
