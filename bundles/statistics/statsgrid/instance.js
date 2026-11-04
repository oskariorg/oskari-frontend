import React from 'react';
import { MyIndicatorsHandler } from './handler/MyIndicatorsHandler';
import { ViewHandler } from './handler/ViewHandler';
import { SearchHandler } from './handler/SearchHandler';
import { StateHandler } from './handler/StatisticsHandler';
import { IndicatorFormHandler } from './handler/IndicatorFormHandler';
import { MyIndicatorsTab } from './MyIndicatorsTab';
import { initConfig, getDatasources } from './helper/ConfigHelper';
import { getDataProviderKey } from './helper/StatisticsHelper';
import { LAYER_ID, DATA_PROVIDER } from './constants';
import { NavigationAdapter } from 'oskari-ui/util/NavigationAdapter';
import { MenuSubItems } from './MenuSubItems';

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

const MENU_ITEM_ID = 'statsgrid-item';
const DEFAULT_SANDBOX = 'sandbox';
const SEARCH_VIEW = 'search';
const UPDATE_EXTENSION_REQUEST = 'userinterface.UpdateExtensionRequest';
const ATTACH = 'attach';
const CLOSE = 'close';

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
            sandbox: DEFAULT_SANDBOX,
            stateful: true,
            tileClazz: 'Oskari.statistics.statsgrid.Tile'
        };
        this.loc = Oskari.getMsg.bind(null, 'StatsGrid');
        this.log = Oskari.log('Oskari.statistics.statsgrid.StatsGridBundleInstance');

        this.stateHandler = null;
        this.searchHandler = null;
        this.regionsetViewer = null;
        this.activeNavigationViews = new Set();
        this.navigation = new NavigationAdapter(this, {
            createMenuItem: (navigation) => this.createMenuItem(navigation),
            onStart: () => this.startMainNavigation(),
            onStop: () => this.stopMainNavigation()
        });
    }, {
        start: function () {
            const conf = this.getConfiguration();
            const sandbox = Oskari.getSandbox(conf?.sandbox || DEFAULT_SANDBOX);
            this.sandbox = sandbox;
            sandbox.register(this);
            if (conf?.stateful === true) {
                sandbox.registerAsStateful(this.mediator.bundleId, this);
            }
            this.navigation.start();
            this.afterStart(sandbox);
        },
        stop: function () {
            const result = this.navigation.stop();
            if (this.navigation.service) {
                return result;
            }
            const sandbox = this.getSandbox();
            sandbox.unregisterStateful(this.mediator.bundleId);
            sandbox.unregister(this);
            this.sandbox = null;
            this.started = false;
        },
        startMainNavigation: function () {
            const sandbox = this.getSandbox();
            Object.keys(this.requestHandlers).forEach(name => sandbox.requestHandler(name, this));
            Object.keys(this.eventHandlers).forEach(name => sandbox.registerForEventByName(this, name));
        },
        stopMainNavigation: function () {
            this.getViewHandler()?.closeAll();
            this.activeNavigationViews.clear();
            const sandbox = this.getSandbox();
            Object.keys(this.eventHandlers).forEach(name => sandbox.unregisterFromEventByName(this, name));
            Object.keys(this.requestHandlers).forEach(name => sandbox.removeRequestHandler(name, this));
        },
        createMenuItem: function ({ MenuItem, MenuItemActivationResult }) {
            const title = this.loc('flyout.title');
            return new MenuItem({
                id: MENU_ITEM_ID,
                sortOrder: 20,
                name: title,
                tooltip: title,
                setActive: (isActive) => {
                    if (!isActive) {
                        this.getViewHandler()?.close(SEARCH_VIEW);
                    }
                    this.updateMainNavigationSubItems(isActive);
                    return MenuItemActivationResult.OK;
                }
            });
        },
        updateMainNavigationSubItems: function (isActive = this.navigation.menuItem?.isActive) {
            this.navigation.menuItem?.setSubItems(isActive
                ? <MenuSubItems
                    activeViews={[...this.activeNavigationViews]}
                    onToggle={id => this.getViewHandler().toggle(id)}
                    loc={this.loc}
                />
                : null);
        },
        setNavigationViewActive: function (viewId, isOpen) {
            if (isOpen) {
                this.activeNavigationViews.add(viewId);
            } else {
                this.activeNavigationViews.delete(viewId);
            }
            this.updateMainNavigationSubItems();
        },
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
                if (this.navigation.service) {
                    this.navigation.service.setActive(MENU_ITEM_ID, false);
                } else {
                    this.getSandbox().postRequestByName(UPDATE_EXTENSION_REQUEST, [this, CLOSE]);
                }
            },
            'userinterface.ExtensionUpdatedEvent': function (event) {
                // Not handle other extension update events
                if (this.navigation.service || event.getExtension().getName() !== this.getName()) {
                    return;
                }
                if (event.getViewState() === CLOSE) {
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
                const isAttached = this.navigation.service ? this.navigation.menuItem.isActive : this.getTile().isAttached();
                if (!isAttached && this.stateHandler.getState().indicators.length < 1) {
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
            if (this.navigation.service) {
                this.navigation.service.setActive(MENU_ITEM_ID, true);
                this.getViewHandler()?.show(SEARCH_VIEW);
            } else {
                this.getViewHandler()?.show(SEARCH_VIEW);
                this.getSandbox().postRequestByName(UPDATE_EXTENSION_REQUEST, [this, ATTACH]);
            }
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
