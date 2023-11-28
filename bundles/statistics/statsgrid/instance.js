import { MyIndicatorsHandler } from './handler/MyIndicatorsHandler';
import { MyIndicatorsTab } from './MyIndicatorsTab';
import './FlyoutManager.js';
import '../statsgrid2016/Tile.js';
import './service/StatisticsService.js';
import './service/SeriesService.js';
import '../statsgrid2016/service/ClassificationService.js';
import '../statsgrid2016/service/ColorService.js';
import '../statsgrid2016/service/ErrorService.js';
import './service/Cache.js';
import './service/CacheHelper.js';
import '../statsgrid2016/components/RegionsetSelector.js';
import '../statsgrid2016/components/SelectedIndicatorsMenu.js';
import '../statsgrid2016/components/SpanSelect.js';
import '../statsgrid2016/view/Filter.js';
import './plugin/TogglePlugin.js';
import '../statsgrid2016/components/SeriesControl.js';
import '../statsgrid2016/publisher/SeriesToggleTool.js';
import './components/RegionsetViewer.js';
import '../statsgrid2016/event/IndicatorEvent.js';
import '../statsgrid2016/event/DatasourceEvent.js';
import '../statsgrid2016/event/FilterEvent.js';
import '../statsgrid2016/event/RegionsetChangedEvent.js';
import '../statsgrid2016/event/ActiveIndicatorChangedEvent.js';
import '../statsgrid2016/event/RegionSelectedEvent.js';
import '../statsgrid2016/event/ClassificationChangedEvent.js';
import '../statsgrid2016/event/ParameterChangedEvent.js';
import '../statsgrid2016/event/StateChangedEvent.js';
import '../statsgrid2016/publisher/AbstractStatsPluginTool.js';
import '../statsgrid2016/publisher/StatsTableTool.js';
import '../statsgrid2016/publisher/ClassificationTool';
import '../statsgrid2016/publisher/ClassificationToggleTool.js';
import '../statsgrid2016/publisher/OpacityTool.js';
import './plugin/ClassificationPlugin.js';
import '../statsgrid2016/plugin/SeriesControlPlugin.js';
import '../statsgrid2016/publisher/DiagramTool.js';

const TOGGLE_TOOL_SERIES = 'series';
const TOGGLE_TOOL_CLASSIFICATION = 'classification';

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
        this.seriesControlPlugin = null;

        this.regionsetViewer = null;
        this.flyoutManager = null;
        this._layerId = 'STATS_LAYER';
        this.loc = Oskari.getMsg.bind(null, 'StatsGrid');

        this.stateHandler = null;
    }, {
        afterStart: function (sandbox) {
            const locale = Oskari.getMsg.bind(null, 'StatsGrid');
            // create the StatisticsService for handling ajax calls and common functionality.
            const statsService = Oskari.clazz.create('Oskari.statistics.statsgrid.StatisticsService', sandbox, locale);
            sandbox.registerService(statsService);
            this.statsService = statsService;
            const conf = this.getConfiguration() || {};

            this.stateHandler = statsService.getStateHandler();

            this.stateHandler.addDatasource(conf.sources);
            this.stateHandler.addRegionset(conf.regionsets);

            // initialize flyoutmanager
            this.flyoutManager = Oskari.clazz.create('Oskari.statistics.statsgrid.FlyoutManager', this, this.stateHandler);
            this.flyoutManager.init();
            this.getTile().setupTools(this.flyoutManager);

            this.togglePlugin = Oskari.clazz.create('Oskari.statistics.statsgrid.TogglePlugin', this.getFlyoutManager(), conf.location?.classes);
            const mapModule = sandbox.findRegisteredModuleInstance('MainMapModule');
            mapModule.registerPlugin(this.togglePlugin);
            mapModule.startPlugin(this.togglePlugin);

            if (this.isEmbedded()) {
                // Start in an embedded map mode
                if (conf.grid) {
                    this.togglePlugin.addTool('table');
                }
                if (conf.diagram) {
                    this.togglePlugin.addTool('diagram');
                }
                if (conf.classification) {
                    this.addMapPluginToggleTool(TOGGLE_TOOL_CLASSIFICATION);
                }
                if (conf.series) {
                    this.addMapPluginToggleTool(TOGGLE_TOOL_SERIES);
                }
            }
            // Add tool for statslayers so selected layers can show a link to open the statsgrid functionality
            this.__setupLayerTools();

            // regionsetViewer creation need be there because of start order
            this.regionsetViewer = Oskari.clazz.create('Oskari.statistics.statsgrid.RegionsetViewer', this, sandbox, this.conf);

            this.addVectorLayer();

            // Check that user has own indicators datasource
            if (statsService.getUserDatasource()) {
                this._addIndicatorsTabToMyData(sandbox);
            }
            // setup initial state
            this.setState();

            // listen for search closing to remove stats layer if no indicators was found
            this.flyoutManager.on('hide', id => {
                if (id === 'search' && this.stateHandler.getState().indicators?.length < 1) {
                    this._removeStatsLayer();
                }
            });
        },
        _addIndicatorsTabToMyData: function (sandbox, appStarted) {
            let myDataService = sandbox.getService('Oskari.mapframework.bundle.mydata.service.MyDataService');

            if (myDataService) {
                myDataService.addTab('indicators', this.loc('tab.title'), MyIndicatorsTab, new MyIndicatorsHandler(sandbox, this, this.stateHandler.getController().getFormHandler()));
            } else if (!appStarted) {
                // Wait for the application to load all bundles and try again
                Oskari.on('app.start', () => {
                    this._addIndicatorsTabToMyData(sandbox, true);
                });
            }
        },
        addMapPluginToggleTool: function (tool) {
            if (!this.togglePlugin || !tool) {
                return;
            }
            let plugin;
            switch (tool) {
            case TOGGLE_TOOL_CLASSIFICATION:
                plugin = 'classificationPlugin'; break;
            case TOGGLE_TOOL_SERIES:
                plugin = 'seriesControlPlugin'; break;
            }
            if (!plugin) {
                return;
            }
            this.togglePlugin.addTool(tool, () => {
                if (this[plugin]) {
                    this[plugin].toggleUI();
                }
            });
            const visible = this[plugin] && this[plugin].isVisible();
            this.togglePlugin.toggleTool(tool, visible);
        },
        isEmbedded: function () {
            return Oskari.dom.isEmbedded();
        },
        hasData: function () {
            return !!this.statsService.getDatasources().length;
        },
        getLayerId: function () {
            return this._layerId;
        },
        isLayerHidden: function () {
            const layer = this.getLayerService().findMapLayer(this._layerId);
            return layer ? !layer.isVisible() : false;
        },
        /**
         * Update visibility of classification / legend based on idicators length & stats layer visibility
         */
        updateClassficationViewVisibility: function () {
            const indicatorsExist = this.stateHandler.getState().indicators?.length > 0;
            this._setClassificationViewVisible(indicatorsExist && !this.isLayerHidden());
        },
        /**
         * Update visibility of series control based on active indicator & stats layer visibility
         */
        updateSeriesControlVisibility: function () {
            const isSeriesActive = this.statsService.isSeriesActive();
            this._setSeriesControlVisible(isSeriesActive && !this.isLayerHidden());
        },
        _removeStatsLayer: function () {
            const builder = Oskari.requestBuilder('RemoveMapLayerRequest');
            Oskari.getSandbox().request(this.getName(), builder(this._layerId));
        },
        /**
         * Fetches reference to the map layer service
         * @return {Oskari.mapframework.service.MapLayerService}
         */
        getLayerService: function () {
            return this.getSandbox().getService('Oskari.mapframework.service.MapLayerService');
        },
        getFlyoutManager: function () {
            return this.flyoutManager;
        },
        getStatisticsService: function () {
            return this.statsService;
        },
        getDataProviderInfoService: function () {
            return this.getSandbox().getService('Oskari.map.DataProviderInfoService');
        },
        /**
         * This will trigger an update on the LogoPlugin/Datasources popup when available.
         * @param  {StatsGrid.IndicatorEvent} event
         */
        notifyDataProviderInfo: function (event) {
            const ind = {
                datasource: event.getDatasource(),
                indicator: event.getIndicator(),
                selections: event.getSelections()
            };
            if (event.isRemoved()) {
                this.removeDataProviverInfo(ind);
            } else {
                this.addDataProviderInfo(ind);
            }
        },
        removeDataProviverInfo: function (ind) {
            const { datasource, indicator } = ind;
            // the check if necessary if the same indicator is added more than once with different selections
            if (!this.statsService.isSelected(datasource, indicator)) {
                // if this was the last dataset for the datasource & indicator. Remove it.
                const service = this.getDataProviderInfoService();
                if (service) {
                    const id = datasource + '_' + indicator;
                    service.removeItemFromGroup('indicators', id);
                }
            }
        },
        addDataProviderInfo: async function (ind) {
            const service = this.getDataProviderInfoService();
            if (!service) return;
            const { datasource, indicator, selections } = ind;
            const { name, info: { url } } = this.statsService.getDatasource(datasource);
            const id = datasource + '_' + indicator;

            const labels = await this.statsService.getUILabels({ datasource, indicator, selections });
            const data = {
                id,
                name: labels.indicator,
                source: [labels.source, { name, url }]
            };
            if (!service.addItemToGroup('indicators', data)) {
                // if adding failed, it might because group was not registered.
                service.addGroup('indicators', this.getLocalization().dataProviderInfoTitle);
                // Try adding again
                service.addItemToGroup('indicators', data);
            }
        },
        clearDataProviderInfo: function () {
            const service = this.getDataProviderInfoService();
            if (service) {
                service.removeGroup('indicators');
            }
        },
        /**
         * Add vectorlayer to map for features. Layer is empty on module start.
         */
        addVectorLayer: function () {
            const locale = this.getLocalization();
            this.sandbox.postRequestByName(
                'VectorLayerRequest',
                [
                    {
                        layerId: this._layerId,
                        showLayer: 'registerOnly',
                        layerName: locale.layer.name,
                        layerInspireName: locale.layer.inspireName,
                        layerOrganizationName: locale.layer.organizationName,
                        layerPermissions: {
                            publish: 'publication_permission_ok'
                        }
                    }
                ]
            );
        },
        eventHandlers: {
            'StatsGrid.StateChangedEvent': function (evt) {
                if (evt.isReset()) {
                    this._removeStatsLayer();
                    this.flyoutManager.hideFlyouts();
                } else {
                    this.stateHandler.getState().indicators.forEach(ind => {
                        this.addDataProviderInfo(ind);
                    });
                    this.updateSeriesControlVisibility();
                    this.updateClassficationViewVisibility();
                }
                // notify other components
                this.statsService.notifyOskariEvent(evt);
            },
            'StatsGrid.IndicatorEvent': function (evt) {
                this.statsService.notifyOskariEvent(evt);
                this.notifyDataProviderInfo(evt);
                this.updateClassficationViewVisibility();
            },
            'StatsGrid.RegionsetChangedEvent': function (evt) {
                this.statsService.notifyOskariEvent(evt);
            },
            'StatsGrid.RegionSelectedEvent': function (evt) {
                this.statsService.notifyOskariEvent(evt);
            },
            'StatsGrid.ActiveIndicatorChangedEvent': function (evt) {
                this.statsService.notifyOskariEvent(evt);
                this.updateSeriesControlVisibility();
            },
            'StatsGrid.ClassificationChangedEvent': function (evt) {
                this.statsService.notifyOskariEvent(evt);
            },
            'StatsGrid.DatasourceEvent': function (evt) {
                this.statsService.notifyOskariEvent(evt);
            },
            'StatsGrid.ParameterChangedEvent': function (evt) {
                this.statsService.notifyOskariEvent(evt);
            },
            'StatsGrid.Filter': function (evt) {
                this.statsService.notifyOskariEvent(evt);
            },
            'StatsGrid.ClassificationPluginChanged': function (evt) {
                this.statsService.notifyOskariEvent(evt);
            },
            'MapSizeChangedEvent': function (evt) {
                this.statsService.notifyOskariEvent(evt);
            },
            'UIChangeEvent': function (evt) {
                this.getSandbox().postRequestByName('userinterface.UpdateExtensionRequest', [this, 'close']);
            },
            'userinterface.ExtensionUpdatedEvent': function (event) {
                // Not handle other extension update events
                if (event.getExtension().getName() !== this.getName()) {
                    return;
                }
                if (event.getViewState() === 'close') {
                    this.getTile().hideExtensions();
                } else {
                    this.getTile().showExtensions();
                }
            },
            'AfterMapLayerRemoveEvent': function (event) {
                if (event.getMapLayer().getId() !== this._layerId) {
                    return;
                }
                this.clearDataProviderInfo();
                this._setClassificationViewVisible(false);
                this._setSeriesControlVisible(false);
                this.statsService.notifyOskariEvent(event);
            },
            /**
             * @method MapLayerEvent
             * @param {Oskari.mapframework.event.common.MapLayerEvent} event
             *
             */
            'MapLayerEvent': function (event) {
                if (!this.getTile()) {
                    return;
                }
                // Enable tile when stats layer is available
                // this.getTile().setEnabled(this.hasData());
                // setup tools for new layers
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
            'AfterMapLayerAddEvent': function (event) {
                // listen event only when statsgrid isn't active
                if (event.getMapLayer().getId() !== this._layerId || this.getTile().isAttached()) {
                    return;
                }
                if (this.stateHandler.getState().indicators.length < 1) {
                    this.getSandbox().postRequestByName('userinterface.UpdateExtensionRequest', [this, 'attach']);
                } else {
                    // layer has added from layerlist and has indicators.
                    // notify other components with state changed to get full render
                    this.getSandbox().notifyAll(Oskari.eventBuilder('StatsGrid.StateChangedEvent')());
                }
            },
            'MapLayerVisibilityChangedEvent': function (event) {
                var layer = event.getMapLayer();
                if (!layer || layer.getId() !== this._layerId) {
                    return;
                }
                this.updateClassficationViewVisibility();
                this.updateSeriesControlVisibility();
            },
            'FeatureEvent': function (evt) {
                this.statsService.notifyOskariEvent(evt);
            },
            'AfterChangeMapLayerOpacityEvent': function (evt) {
                if (evt.getMapLayer().getId() !== this._layerId) {
                    return;
                }
                // record opacity for published map etc
                this.stateHandler.getController().updateClassificationTransparency(evt.getMapLayer().getOpacity());
                this.statsService.notifyOskariEvent(evt);
            }
        },

        /**
         * Adds the Feature data tool for layer
         * @param  {String| Number} layerId layer to process
         * @param  {Boolean} suppressEvent true to not send event about updated layer (optional)
         */
        __addTool: function (layerModel, suppressEvent) {
            var me = this;
            var service = this.getLayerService();
            if (typeof layerModel !== 'object') {
                // detect layerId and replace with the corresponding layerModel
                layerModel = service.findMapLayer(layerModel);
            }
            if (!layerModel || !layerModel.isLayerOfType('STATS')) {
                return;
            }
            // add feature data tool for layer
            var layerLoc = this.getLocalization('layertools').table_icon || {};
            var label = layerLoc.title || 'Thematic maps';
            var tool = Oskari.clazz.create('Oskari.mapframework.domain.Tool');
            tool.setName('table_icon');
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
        __setupLayerTools: function () {
            // add tools for feature data layers
            var service = this.getLayerService();
            var layers = service.getAllLayers();
            layers.forEach(layer => this.__addTool(layer, true));
            // update all layers at once since we suppressed individual events
            var event = Oskari.eventBuilder('MapLayerEvent')(null, 'tool');
            this.sandbox.notifyAll(event);
        },

        /**
         * Sets the map state to one specified in the parameter. State is bundle specific, check the
         * bundle documentation for details.
         *
         * @method setState
         * @param {Object} newState bundle state as JSON
         */
        setState: function (newState) {
            const state = newState || this.state || {};
            if (state.indicators && state.indicators.length) {
                this.stateHandler.getController().setFullState(state);
            } else {
                // if state doesn't have indicators, reset state
                this.stateHandler.getController().resetState();
            }
            // if state says view was visible fire up the UI, otherwise close it
            var uimode = state.view ? 'attach' : 'close';
            this.getSandbox().postRequestByName('userinterface.UpdateExtensionRequest', [this, uimode]);
        },
        getState: function () {
            // State isn't cleared when stats layer is removed
            // return full state only if stats layer is selected
            if (this.sandbox.isLayerAlreadySelected(this._layerId)) {
                const state = this.stateHandler.getState();
                return {
                    activeIndicator: state.activeIndicator,
                    regionset: state.activeRegionset,
                    indicators: state.indicators,
                    activeRegion: state.activeRegion,
                    lastSelectedClassification: state.lastSelectedClassification,
                    view: this.visible
                };
            }
            return {
                view: this.visible
            };
        },
        createClassificationView: function () {
            const config = jQuery.extend(true, {}, this.getConfiguration());
            this.classificationPlugin = Oskari.clazz.create('Oskari.statistics.statsgrid.ClassificationPlugin', this, config);
            this.classificationPlugin.on('show', () => this.togglePlugin && this.togglePlugin.toggleTool(TOGGLE_TOOL_CLASSIFICATION, true));
            this.classificationPlugin.on('hide', () => this.togglePlugin && this.togglePlugin.toggleTool(TOGGLE_TOOL_CLASSIFICATION, false));
            this.classificationPlugin.buildUI();
        },
        // TODO do we need to unregister plugin
        removeClassificationView: function () {
            if (this.classificationPlugin) {
                const mapModule = this.getSandbox().findRegisteredModuleInstance('MainMapModule');
                mapModule.unregisterPlugin(this.classificationPlugin);
                mapModule.stopPlugin(this.classificationPlugin);
                this.classificationPlugin = null;
            }
        },
        _setClassificationViewVisible: function (visible) {
            if (!this.classificationPlugin && visible) {
                this.createClassificationView();
                return;
            }
            if (visible) {
                this.classificationPlugin.buildUI();
            } else if (this.classificationPlugin) {
                this.classificationPlugin.stopPlugin();
            }
        },
        _setSeriesControlVisible: function (visible) {
            if (visible) {
                if (this.seriesControlPlugin) {
                    if (!this.seriesControlPlugin.getElement()) {
                        this.seriesControlPlugin.redrawUI();
                    }
                } else {
                    this.createSeriesControl();
                }
            } else {
                if (this.seriesControlPlugin) {
                    this.seriesControlPlugin.stopPlugin();
                }
            }
        },
        createSeriesControl: function () {
            var sandbox = this.getSandbox();
            var locale = Oskari.getMsg.bind(null, 'StatsGrid');
            var mapModule = sandbox.findRegisteredModuleInstance('MainMapModule');

            this.seriesControlPlugin = Oskari.clazz.create('Oskari.statistics.statsgrid.SeriesControlPlugin', this, {}, locale, sandbox);
            this.seriesControlPlugin.on('show', () => this.togglePlugin && this.togglePlugin.toggleTool(TOGGLE_TOOL_SERIES, true));
            this.seriesControlPlugin.on('hide', () => this.togglePlugin && this.togglePlugin.toggleTool(TOGGLE_TOOL_SERIES, false));
            mapModule.registerPlugin(this.seriesControlPlugin);
            mapModule.startPlugin(this.seriesControlPlugin);
        }

    }, {
        extend: ['Oskari.userinterface.extension.DefaultExtension']
    }
);
