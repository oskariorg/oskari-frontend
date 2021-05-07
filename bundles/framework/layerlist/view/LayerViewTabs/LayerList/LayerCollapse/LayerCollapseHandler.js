import { StateHandler, controllerMixin } from 'oskari-ui/util';
import { groupLayers } from './util';
import { FILTER_ALL_LAYERS } from '..';

const ANIMATION_TIMEOUT = 400;
const LAYER_REFRESH_THROTTLE = 2000;

/* ------------- Helpers to determine group structure based on layers and groups on maplayerservice ------ */
const getLayerGroups = (groups = []) => {
    return groups.map(group => {
        return {
            id: group.id,
            name: Oskari.getLocalized(group.name),
            layers: group.getChildren().filter(c => c.type === 'layer') || [],
            groups: getLayerGroups(group.getGroups())
        };
    });
};

const providerReducer = (accumulator, currentLayer) => {
    // TODO: once we have id, use it
    const org = Oskari.getLocalized(currentLayer.getOrganizationName());
    if (!org) {
        return accumulator;
    }
    let orgLayers = accumulator[org] || [];
    if (!orgLayers.length) {
        accumulator[org] = orgLayers;
    }
    orgLayers.push({ id: currentLayer.getId() });
    return accumulator;
};

const getDataProviders = (fromService = [], layers = []) => {
    // Note! fromService will be an empty array if admin-layereditor is not started on the appsetup
    // TODO: determine map provider -> layers list mapping with reduce
    const providerMapping = layers.reduce(providerReducer, {});
    if (!fromService.length) {
        return Object.keys(providerMapping).map(name => {
            return {
                // generate an id when we don't have the id (== when admin-layereditor is not on the appsetup)
                // use negative number just in case to make it "non-editable"
                id: -Oskari.seq.nextVal('dummyProviders'),
                name,
                layers: providerMapping[name] || [],
                groups: []
            };
        });
    }
    return fromService.map(dataProvider => {
        const name = dataProvider.name;
        return {
            id: dataProvider.id,
            name,
            layers: providerMapping[name] || [],
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
const filterGroups = (groups = [], searchText) => {
    if (!searchText || !searchText.trim()) {
        return groups;
    }
    return groups.map(group => {
        group.unfilteredLayerCount = group.layers.length;
        group.layers = group.layers.filter(lyr => group.matchesKeyword(lyr.getId(), searchText));
        group.groups = filterGroups(group.groups, searchText);
        if (!group.layers.length && !group.groups.length) {
            // no layers and no subgroups with layers
            return;
        }
        return group;
    }).filter(group => typeof group !== 'undefined');
};

/* ------------- /Helpers ------ */

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
        const { searchText, activeId: filterId } = this.filter;
        const isPresetFiltered = filterId !== FILTER_ALL_LAYERS;
        const layers = !isPresetFiltered ? this.mapLayerService.getAllLayers() : this.mapLayerService.getFilteredLayers(filterId);
        const tools = Object.values(this.toolingService.getTools()).filter(tool => tool.getTypes().includes('layergroup'));

        // For admin users all groups and all data providers are provided to groupLayers function to include possible empty groups to layerlist.
        // For non admin users empty arrays are provided and with this empty groups are not included to layerlist.
        let groupsToProcess = [];
        const isDataProviders = (this.groupingMethod !== 'getInspireName');
        // normalize groups and dataproviders structure
        if (!isDataProviders) {
            groupsToProcess = getLayerGroups(this.mapLayerService.getAllLayerGroups());
        } else {
            groupsToProcess = getDataProviders(this.mapLayerService.getDataProviders(), layers);
        }

        const groups = groupLayers([...layers], this.groupingMethod, tools, groupsToProcess, this.loc.grouping.noGroup, isPresetFiltered);
        this.updateState({ groups: filterGroups(groups, searchText) });
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
        return 'LayerCollapse.CollapseService.' + this.groupingMethod;
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
