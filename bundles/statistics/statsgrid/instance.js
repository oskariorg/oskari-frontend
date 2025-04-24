import { MyIndicatorsHandler } from './handler/MyIndicatorsHandler';
import { ViewHandler } from './handler/ViewHandler';
import { SearchHandler } from './handler/SearchHandler';
import { StateHandler } from './handler/StatisticsHandler';
import { IndicatorFormHandler } from './handler/IndicatorFormHandler';
import { MyIndicatorsTab } from './MyIndicatorsTab';
import { initConfig, getDatasources } from './helper/ConfigHelper';
import { getDataProviderKey } from './helper/StatisticsHelper';
import { LAYER_ID, DATA_PROVIDER } from './constants';

import './Tile.js';
import './components/SeriesControl.js';
import './components/RegionsetViewer.js';
import './plugin/TogglePlugin.js';
import './plugin/SeriesControlPlugin.js';

import './publisher/AbstractStatsPluginTool.js';
import './publisher/StatsTableTool.js';
import './publisher/ClassificationTool';
import './publisher/ClassificationToggleTool.js';
import './publisher/OpacityTool.js';
import './publisher/DiagramTool.js';
import './publisher/SeriesToggleTool.js';
import './publisher/StatisticsTool.js';
import './publisher/StatsgridPanel.js';

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
            tileClazz: 'Oskari.statistics.statsgrid.Tile'
        };
        this.loc = Oskari.getMsg.bind(null, 'StatsGrid');
        this.log = Oskari.log('Oskari.statistics.statsgrid.StatsGridBundleInstance');

        this.stateHandler = null;
        this.searchHandler = null;
        this.regionsetViewer = null;
    }, {
        afterStart: function (sandbox) {
            const conf = this.getConfiguration() || {};
            initConfig(conf);

            // Pass handlers to others to keep right init order
            this.stateHandler = new StateHandler(this);
            this.searchHandler = new SearchHandler(this, this.stateHandler);
            this.viewHandler = new ViewHandler(this, this.stateHandler, this.searchHandler);
            if (Oskari.dom.isEmbedded()) {
                this.viewHandler.setEmbeddedTools(conf);
            }

            // regionsetViewer creation need be there because of start order
            this.regionsetViewer = Oskari.clazz.create('Oskari.statistics.statsgrid.RegionsetViewer', this);

            // Check that user has own indicators datasource
            const userDsId = getDatasources().find(ds => ds.type === 'user')?.id;
            if (userDsId) {
                const formHandler = new IndicatorFormHandler(this);
                this.viewHandler.setIndicatorFormHandler(formHandler);
                this._addIndicatorsTabToMyData(formHandler, userDsId);
            }
            // setup initial state
            this.setState();
            this.addVectorLayer();
        },
        _addIndicatorsTabToMyData: function (formHandler, userDsId, appStarted) {
            if (!Oskari.user().isLoggedIn()) {
                return;
            }
            const sandbox = this.getSandbox();
            const myDataService = sandbox.getService('Oskari.mapframework.bundle.mydata.service.MyDataService');

            if (myDataService) {
                this.myIndicatorsHandler = new MyIndicatorsHandler(this, formHandler, userDsId);
                myDataService.addTab('indicators', this.loc('tab.title'), MyIndicatorsTab, this.myIndicatorsHandler);
            } else if (!appStarted) {
                // Wait for the application to load all bundles and try again
                Oskari.on('app.start', () => {
                    this._addIndicatorsTabToMyData(formHandler, userDsId, true);
                });
            }
        },
        /**
         * Fetches reference to the map layer service
         * @return {Oskari.mapframework.service.MapLayerService}
         */
        getLayerService: function () {
            return this.getSandbox().getService('Oskari.mapframework.service.MapLayerService');
        },
        getDataProviderInfoService: function () {
            return this.getSandbox().getService('Oskari.map.DataProviderInfoService');
        },
        getStateHandler: function () {
            return this.stateHandler;
        },
        getViewHandler: function () {
            return this.viewHandler;
        },
        getSearchHandler: function () {
            return this.searchHandler;
        },
        getMyIndicatorsHandler: function () {
            return this.myIndicatorsHandler;
        },
        removeDataProviverInfo: function (ind) {
            const service = this.getDataProviderInfoService();
            if (service) {
                const key = getDataProviderKey(ind);
                service.removeItemFromGroup(DATA_PROVIDER, key);
            }
        },
        addDataProviderInfo: async function (ind) {
            const service = this.getDataProviderInfoService();
            if (!service) {
                return;
            }
            const { name, info: { url } } = getDatasources().find(ds => ds.id === ind.ds) || {};
            const id = getDataProviderKey(ind);
            const data = {
                id,
                name: ind.labels.indicator,
                source: [ind.labels.source, { name, url }]
            };
            if (!service.addItemToGroup(DATA_PROVIDER, data)) {
                // if adding failed, it might because group was not registered.
                service.addGroup(DATA_PROVIDER, this.loc('dataProviderInfoTitle'));
                // Try adding again
                service.addItemToGroup(DATA_PROVIDER, data);
            }
        },
        clearDataProviderInfo: function () {
            const service = this.getDataProviderInfoService();
            if (service) {
                service.removeGroup(DATA_PROVIDER);
            }
        },
        /**
         * Add vectorlayer to map for features. Layer is empty on module start.
         */
        addVectorLayer: function () {
            this.sandbox.postRequestByName(
                'VectorLayerRequest',
                [
                    {
                        layerId: LAYER_ID,
                        showLayer: 'registerOnly',
                        layerName: this.loc('layer.name'),
                        layerInspireName: this.loc('layer.inspireName'),
                        layerOrganizationName: this.loc('layer.organizationName'),
                        layerPermissions: {
                            publish: 'publication_permission_ok'
                        }
                    }
                ]
            );
        },
        eventHandlers: {
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
                if (event.getMapLayer().getId() !== LAYER_ID) {
                    return;
                }
                this.getViewHandler()?.updateLayer('onMap', false);
                this.regionsetViewer.clearRegions();
            },
            'MapLayerEvent': function (event) {
                if (event.getOperation() !== 'add' || event.getLayerId() !== LAYER_ID) {
                    // only handle add layer
                    return;
                }
                this.__addTool();
            },
            'AfterMapLayerAddEvent': function (event) {
                if (event.getMapLayer().getId() !== LAYER_ID) {
                    return;
                }
                this.getViewHandler().updateLayer('onMap', true);
                if (!this.getTile().isAttached() && this.stateHandler.getState().indicators.length < 1) {
                    // layer has added from layerlist and doesn't have indicators
                    this.showSearchFlyout();
                }
            },
            'MapLayerVisibilityChangedEvent': function (event) {
                const layer = event.getMapLayer();
                if (!layer || layer.getId() !== LAYER_ID) {
                    return;
                }
                this.getViewHandler()?.updateLayer('visible', layer.isVisible());
            },
            'AfterChangeMapLayerOpacityEvent': function (evt) {
                if (evt.getMapLayer().getId() !== LAYER_ID) {
                    return;
                }
                const opacity = evt.getMapLayer().getOpacity();
                this.getStateHandler().onLayerOpacityChange(opacity);
            },
            'FeatureEvent': function (event) {
                if (event.getParams().operation !== 'click' || !event.hasFeatures() || !this.stateHandler) {
                    return;
                }
                // resolve region
                const topmostFeature = event.getParams().features[0];
                if (topmostFeature.layerId !== LAYER_ID) {
                    return;
                }
                const region = topmostFeature.geojson.features[0].properties.id;
                this.getStateHandler().setActiveRegion(region);
            }
        },
        showSearchFlyout: function () {
            this.getViewHandler()?.show('search');
            this.getSandbox().postRequestByName('userinterface.UpdateExtensionRequest', [this, 'attach']);
        },

        __addTool: function () {
            const service = this.getLayerService();
            // detect layerId and replace with the corresponding layerModel
            const layerModel = service.findMapLayer(LAYER_ID);
            if (!layerModel) {
                return;
            }
            const tool = Oskari.clazz.create('Oskari.mapframework.domain.Tool');
            tool.setName('table_icon');
            tool.setTitle(this.loc('layerTool.title'));
            tool.setTooltip(this.loc('layerTool.tooltip'));
            tool.setCallback(() => this.showSearchFlyout());
            service.addToolForLayer(layerModel, tool, false);
        },
        setState: function (newState) {
            const state = newState || this.state || {};
            this.getStateHandler().setStoredState(state);
        },
        getState: function () {
            return this.getStateHandler().getStateToStore();
        }
    }, {
        extend: ['Oskari.userinterface.extension.DefaultExtension']
    }
);
