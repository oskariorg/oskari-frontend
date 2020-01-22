import { StateHandler, controllerMixin } from 'oskari-ui/util';
import { groupLayers } from './util';

const ANIMATION_TIMEOUT = 400;
const LAYER_REFRESH_THROTTLE = 2000;

/**
 * Holds and mutates layer list state.
 * Handles events related to layer listing.
 */
class ViewHandler extends StateHandler {
    constructor (instance, groupingMethod = 'getInspireName') {
        super();
        this.sandbox = instance.getSandbox();
        this.loc = instance._localization;
        this.mapLayerService = this.sandbox.getService('Oskari.mapframework.service.MapLayerService');
        this.mapLayerService.on('theme.update', () => this.updateLayerGroups());
        this.mapLayerService.on('dataProvider.update', () => this.updateLayerGroups());
        this.toolingService = this.sandbox.getService('Oskari.mapframework.service.LayerListToolingService');
        this.toolingService.on('add', () => this.updateLayerGroups());
        this.map = this.sandbox.getMap();
        this.groupingMethod = groupingMethod;
        this.filter = {
            activeId: null,
            text: null
        };
        this.state = {
            groups: [],
            openGroupTitles: [],
            selectedLayerIds: this._getSelectedLayerIds()
        };
        this.eventHandlers = this._createEventHandlers();
    }
    setGroupingMethod (groupingMethod) {
        if (this.groupingMethod === groupingMethod) {
            return;
        }
        this.groupingMethod = groupingMethod;
        this.updateLayerGroups();
    }
    setFilter (activeId, searchText) {
        const previousSearchText = this.filter.searchText;
        this.filter = { activeId, searchText };
        this.updateLayerGroups();

        if (searchText !== previousSearchText) {
            if (searchText) {
                // open all groups
                this.updateState({
                    openGroupTitles: this.state.groups.map(group => group.getTitle())
                });
            } else {
                // close all groups
                this.updateState({ openGroupTitles: [] });
            }
        }
    }
    _getSelectedLayerIds () {
        return this.map.getLayers().map(layer => layer.getId());
    }

    addLayer (id) {
        if (!id || this.state.selectedLayerIds.includes(id)) {
            return;
        }
        const selectedLayerIds = [...this.state.selectedLayerIds, id];
        this.updateState({ selectedLayerIds });
        // Adding a map layer can be a resource exhausting task.
        // Delay request to allow switch animation play smoothly.
        setTimeout(() => this.sandbox.postRequestByName('AddMapLayerRequest', [id]), ANIMATION_TIMEOUT);
    }

    removeLayer (id) {
        const index = this.state.selectedLayerIds.indexOf(id);
        if (index === -1) {
            return;
        }
        const selectedLayerIds = [...this.state.selectedLayerIds];
        selectedLayerIds.splice(index, 1);
        this.updateState({ selectedLayerIds });
        setTimeout(() => this.sandbox.postRequestByName('RemoveMapLayerRequest', [id]), ANIMATION_TIMEOUT);
    }

    updateLayerGroups () {
        const { searchText, activeId: filterId } = this.filter;
        const layers = filterId ? this.mapLayerService.getFilteredLayers(filterId) : this.mapLayerService.getAllLayers();
        const tools = Object.values(this.toolingService.getTools()).filter(tool => tool.getTypes().includes('layergroup'));
        const isUserAdmin = tools.length > 0;
        const themes = isUserAdmin ? this.mapLayerService.getAllLayerGroups() : [];
        const dataProviders = isUserAdmin ? this.mapLayerService.getDataProviders() : [];
        let groups = groupLayers([...layers], this.groupingMethod, tools, themes, dataProviders, this.loc);
        if (!searchText) {
            this.updateState({ groups });
            return;
        }
        groups.forEach(group => {
            group.unfilteredLayerCount = group.layers.length;
            group.layers = group.layers.filter(lyr => group.matchesKeyword(lyr.getId(), searchText));
        });
        groups = groups.filter(group => group.layers.length > 0);

        this.updateState({ groups });
    }

    updateOpenGroupTitles (openGroupTitles) {
        this.updateState({ openGroupTitles });
    }

    updateSelectedLayerIds (selectedLayerIds = this._getSelectedLayerIds()) {
        this.updateState({ selectedLayerIds });
    }

    showLayerMetadata (layer) {
        const uuid = layer.getMetadataIdentifier();
        const subUuids = [];
        if (layer.getSubLayers()) {
            layer.getSubLayers().forEach(subLayer => {
                const subUuid = subLayer.getMetadataIdentifier();
                if (subUuid && subUuid !== uuid && !subUuids.includes[subUuid]) {
                    subUuids.push(subUuid);
                }
            });
        }
        this.sandbox.postRequestByName('catalogue.ShowMetadataRequest', [
            { uuid },
            subUuids.map(sub => ({ uuid: sub }))
        ]);
    }

    showLayerBackendStatus (layerId) {
        this.sandbox.postRequestByName('ShowMapLayerInfoRequest', [layerId]);
    }

    /// Oskari event handling ////////////////////////////////////////////////////////////

    /**
     * "Module" name for event handling
     */
    getName () {
        return 'LayerCollapse.CollapseService';
    }

    /**
    * @method onEvent
    * @param {Oskari.mapframework.event.Event} event a Oskari event object
    * Event is handled forwarded to correct #eventHandlers if found or discarded if not.
    */
    onEvent (event) {
        const handler = this.eventHandlers[event.getName()];
        if (!handler) {
            return;
        }
        return handler.apply(this, [event]);
    }

    _createEventHandlers () {
        const sandbox = Oskari.getSandbox();
        const throttleRefreshAll = Oskari.util.throttle(
            this._refreshAllLayers.bind(this),
            LAYER_REFRESH_THROTTLE,
            { leading: false }
        );
        const handlers = {
            'MapLayerEvent': event => {
                const layerId = event.getLayerId();
                const operation = event.getOperation();

                if (['update', 'sticky'].includes(operation)) {
                    this._refreshLayer(layerId);
                } else if (['add', 'remove'].includes(operation)) {
                    this.updateLayerGroups();
                } else if (operation === 'tool') {
                    if (layerId) {
                        this._refreshLayer(layerId);
                        return;
                    }
                    throttleRefreshAll();
                }
            },
            'AfterMapLayerRemoveEvent': () => this.updateSelectedLayerIds(),
            'AfterMapLayerAddEvent': () => this.updateSelectedLayerIds(),
            'BackendStatus.BackendStatusChangedEvent': event => {
                if (event.getLayerId()) {
                    this._refreshLayer(event.getLayerId());
                } else {
                    throttleRefreshAll();
                }
            }
        };
        Object.getOwnPropertyNames(handlers).forEach(p => sandbox.registerForEventByName(this, p));
        return handlers;
    }

    _refreshLayer (id) {
        if (!id || this.state.groups.length === 0) {
            return;
        }
        const groups = this.state.groups.map(group => {
            const layer = group.layers.find(lyr => lyr.getId() === id);
            if (!layer) {
                return group;
            }
            return group.clone();
        });
        this.updateState({ groups });
    }
    _refreshAllLayers () {
        if (this.state.groups.length === 0) {
            return;
        }
        // Clone all groups and layers to ensure rerendering.
        const groups = this.state.groups.map(cur => cur.clone());
        this.updateState({ groups });
    }
}

export const LayerCollapseHandler = controllerMixin(ViewHandler, [
    'addLayer',
    'removeLayer',
    'updateOpenGroupTitles',
    'updateLayerGroups',
    'updateSelectedLayerIds',
    'showLayerMetadata',
    'showLayerBackendStatus'
]);
