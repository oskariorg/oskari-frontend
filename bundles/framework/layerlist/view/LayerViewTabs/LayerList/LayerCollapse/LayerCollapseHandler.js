import { StateHandler, controllerMixin } from 'oskari-ui/util';
import { groupLayers } from './util';
import { FILTER_ALL_LAYERS } from '..';
import { GROUPING_PRESET, GROUPING_DATAPROVIDER } from '../preset';
import { Messaging } from 'oskari-ui/util';

const ANIMATION_TIMEOUT = 400;
const LAYER_REFRESH_THROTTLE = 2000;
const GROUPING_METHODS = {};
GROUPING_PRESET.forEach(preset => {
    GROUPING_METHODS[preset.key] = preset.method;
});

/* ------------- Helpers to determine group structure based on layers and groups on maplayerservice ------ */
const getLayerGroups = (groups = []) => {
    return groups.map(group => {
        return {
            id: group.id,
            name: group.getName(),
            description: group.getDescription(),
            layers: group.getChildren().filter(c => c.type === 'layer') || [],
            groups: getLayerGroups(group.getGroups())
        };
    });
};

const providerReducer = (accumulator, currentLayer) => {
    const id = currentLayer.getDataProviderId();
    if (!id) {
        return accumulator;
    }
    let dataProviderId = '' + id;
    let orgLayers = accumulator[dataProviderId] || [];
    if (!orgLayers.length) {
        accumulator[dataProviderId] = orgLayers;
    }
    orgLayers.push({ id: currentLayer.getId() });
    return accumulator;
};

const getDataProviders = (providers = [], layers = []) => {
    // Note! providers will be an empty array before layer listing has been loaded/populated
    // get layers by provider { providerId: [... list of layer ids for provider...]}
    const layersByProvider = layers.reduce(providerReducer, {});
    return providers.map(dataProvider => {
        const name = dataProvider.name;
        return {
            id: dataProvider.id,
            name,
            description: dataProvider.desc,
            layers: layersByProvider['' + dataProvider.id] || [],
            groups: []
        };
    });
};

/**
 * Filters an array of groups and checks if layers in them match the input for "searchText".
 * Also recurses into subgroups to check layers in them.
 * @param {Oskari.mapframework.bundle.layerselector2.model.LayerGroup[]} groups an array of groups to filter by searchText
 * @param {String} searchText input to filter by. If empty or "falsy" the groups param is returned as-is.
 * @returns Removes any groups/subgroups that don't have layers matching the searchText.
 */
const filterGroups = (groups = [], searchTerms = []) => {
    if (!searchTerms.length) {
        return groups;
    }
    return groups.map(group => {
        group.unfilteredLayerCount = group.getLayerCount();
        group.layers = group.layers.filter(lyr => group.matchesKeyword(lyr.getId(), searchTerms));
        group.groups = filterGroups(group.groups, searchTerms);
        if (!group.getLayerCount()) {
            // no layers and no subgroups with layers
            return null;
        }
        return group;
    }).filter(group => !!group);
};

/* ------------- /Helpers ------ */

/**
 * Holds and mutates layer list state.
 * Handles events related to layer listing.
 */
class ViewHandler extends StateHandler {
    constructor (instance, groupingType = GROUPING_PRESET[0].key) {
        super();
        this.sandbox = instance.getSandbox();
        this.loc = instance.getLocalization();
        this.mapLayerService = this.sandbox.getService('Oskari.mapframework.service.MapLayerService');
        this.mapLayerService.on('theme.update', () => this.updateLayerGroups());
        this.mapLayerService.on('dataProvider.update', () => this.updateLayerGroups());
        this.toolingService = this.sandbox.getService('Oskari.mapframework.service.LayerListToolingService');
        this.toolingService.on('add', () => this.updateLayerGroups());
        this.map = this.sandbox.getMap();
        this.groupingType = groupingType;
        this.filter = {
            activeId: FILTER_ALL_LAYERS,
            text: null
        };
        this.state = {
            groups: [],
            openGroupTitles: [],
            selectedLayerIds: this._getSelectedLayerIds(),
            selectedGroupIds: []
        };
        this.eventHandlers = this._createEventHandlers();
    }
    setGroupingType (groupingType = GROUPING_PRESET[0].key) {
        if (this.groupingType === groupingType) {
            // grouping stays the same
            return;
        }
        this.groupingType = groupingType;
        this.updateLayerGroups();
    }
    setFilter (activeId, searchText = '') {
        const previousSearchText = this.filter.searchText;
        // Generate search terms by splitting by * and space
        // Opening layerlist with request might send searchText as null
        //  so we need to make sure it's string before processing it.
        //  Nulls are not changed to function param default values, this is required even with default value.
        const normalizedQuery = searchText || '';
        const terms = normalizedQuery
            .replaceAll('*', ' ')
            .replaceAll(',', ' ')
            .split(' ')
            .filter(item => item !== '');
        this.filter = {
            activeId,
            normalizedQuery,
            terms
        };

        this.updateLayerGroups();

        if (searchText !== previousSearchText) {
            if (searchText) {
                // open all groups
                const flatten = (groups) => groups.flatMap(g => [g, ...flatten(g.getGroups())]);
                const allGroupsIds = flatten(this.state.groups).map(g => g.getId());
                this.updateState({
                    openGroupTitles: allGroupsIds
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

        const layer = this.mapLayerService.findMapLayer(id);
        if (layer && !layer.isVisible()) {
            Messaging.notify(this.loc.layer.hiddenNotification);
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

    // active all layers in selected group
    addGroupLayersToMap (group) {
        for (let i in group.layers) {
            if (!group.layers[i]._id || this.state.selectedLayerIds.includes(group.layers[i]._id)) {
                continue;
            }
            const selectedLayerIds = [...this.state.selectedLayerIds, group.layers[i]._id];
            this.updateState({ selectedLayerIds });
            setTimeout(() => this.sandbox.postRequestByName('AddMapLayerRequest', [group.layers[i]._id]), ANIMATION_TIMEOUT);
        }
    }

    // deactivate all layers in group
    removeGroupLayersFromMap (group) {
        for (let i in group.layers) {
            const index = this.state.selectedLayerIds.indexOf(group.layers[i]._id);
            if (index === -1) {
                continue;
            }
            const selectedLayerIds = [...this.state.selectedLayerIds];
            selectedLayerIds.splice(index, 1);
            this.updateState({ selectedLayerIds });
            setTimeout(() => this.sandbox.postRequestByName('RemoveMapLayerRequest', [group.layers[i]._id]), ANIMATION_TIMEOUT);
        }
    }

    updateLayerGroups () {
        const { terms, activeId: filterId } = this.filter;
        const isPresetFiltered = filterId !== FILTER_ALL_LAYERS;
        const layers = !isPresetFiltered ? this.mapLayerService.getAllLayers() : this.mapLayerService.getFilteredLayers(filterId);
        const tools = Object.values(this.toolingService.getTools()).filter(tool => tool.getTypes().includes('layergroup'));

        // For admin users all groups and all data providers are provided to groupLayers function to include possible empty groups to layerlist.
        // For non admin users empty arrays are provided and with this empty groups are not included to layerlist.
        let groupsToProcess = [];
        const isDataProviders = (this.groupingType === GROUPING_DATAPROVIDER);
        // normalize groups and dataproviders structure
        if (!isDataProviders) {
            groupsToProcess = getLayerGroups(this.mapLayerService.getAllLayerGroups());
        } else {
            groupsToProcess = getDataProviders(this.mapLayerService.getDataProviders(), layers);
        }

        const groups = groupLayers([...layers], GROUPING_METHODS[this.groupingType], tools, groupsToProcess, this.loc.grouping.noGroup, isPresetFiltered);
        this.updateState({ groups: filterGroups(groups, terms) });
    }

    updateOpenGroupTitles (openGroupTitles) {
        this.updateState({ openGroupTitles });
    }

    updateSelectedLayerIds (selectedLayerIds = this._getSelectedLayerIds()) {
        this.updateState({ selectedLayerIds });
    }

    // Is this deprecated?
    showLayerMetadata (layer) {
        const uuid = layer.getMetadataIdentifier();
        const layerId = layer.id;
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
            { layerId: layerId },
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
        const throttleGroupUpdate = Oskari.util.throttle(
            this.updateLayerGroups.bind(this),
            LAYER_REFRESH_THROTTLE,
            { leading: false }
        );
        const handlers = {
            'MapLayerEvent': event => {
                const layerId = event.getLayerId();
                const operation = event.getOperation();

                if (operation === 'sticky') {
                    this._refreshLayer(layerId);
                } else if (['add', 'remove', 'update'].includes(operation)) {
                    // heavy op -> throttle
                    throttleGroupUpdate();
                } else if (operation === 'tool') {
                    if (layerId) {
                        this._refreshLayer(layerId);
                        return;
                    }
                    // heavy op -> throttle
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
    'showLayerBackendStatus',
    'addGroupLayersToMap',
    'removeGroupLayersFromMap',
    'showWarn',
    'deactivateGroup'
]);
