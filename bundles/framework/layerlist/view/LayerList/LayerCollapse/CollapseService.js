import { StateHandler, mutatorMixin } from 'oskari-ui/util';

/**
 * Holds and mutates layer list state.
 * Handles events related to layer listing.
 */
class Service extends StateHandler {
    constructor () {
        super();
        this.sandbox = Oskari.getSandbox();
        this.mapLayerService = this.sandbox.getService('Oskari.mapframework.service.MapLayerService');
        this.map = this.sandbox.getMap();
        this.groupingMethod = 'getInspireName';
        this.filter = {
            activeId: null,
            text: ''
        };
        this._throttleLayerRefresh = Oskari.util.throttle(this._refreshAllLayers.bind(this), 2000, { leading: false });
        this._throttleLayerSelection = Oskari.util.throttle(this.updateSelectedLayerIds.bind(this), 2000, { leading: false });
        this.eventHandlers = {};
        this.state = {
            groups: [],
            openGroupTitles: [],
            selectedLayerIds: this._getSelectedLayerIds(),
            mapSrs: this.map.getSrsName()
        };
        this.eventHandlers = this._createEventHandlers();
    }
    /**
     * "Module" name for event handling
     */
    getName () {
        return 'LayerCollapse.StateHandler';
    }
    updateStateWithProps ({ groups, selectedLayerIds, filterKeyword }) {
        this.updateLayerGroups();
    }
    setGroupingMethod (groupingMethod) {
        if (this.groupingMethod === groupingMethod) {
            return;
        }
        this.groupingMethod = groupingMethod;
        this.updateLayerGroups();
    }
    setFilter (activeId, searchText) {
        this.filter = { activeId, searchText };
        this.updateLayerGroups();
    }
    _getSelectedLayerIds () {
        return this.map.getLayers().map(layer => layer.getId());
    }

    /**
     * @method _getLayerGroups
     * @private
     */
    _getLayerGroups (layers, groupingMethod) {
        var groupList = [];
        var group = null;
        var n;
        var layer;
        var groupAttr;

        // sort layers by grouping & name
        layers.sort((a, b) => this._layerListComparator(a, b, groupingMethod));

        for (n = 0; n < layers.length; n += 1) {
            layer = layers[n];
            if (layer.getMetaType && layer.getMetaType() === 'published') {
                // skip published layers
                continue;
            }
            groupAttr = layer[groupingMethod]();
            if (!group || group.getTitle() !== groupAttr) {
                group = Oskari.clazz.create(
                    'Oskari.mapframework.bundle.layerselector2.model.LayerGroup',
                    groupAttr
                );
                groupList.push(group);
            }

            group.addLayer(layer);
        }
        var sortedGroupList = jQuery.grep(groupList, function (group, index) {
            return group.getLayers().length > 0;
        });
        return sortedGroupList;
    }

    /**
     * @method _layerListComparator
     * Uses the private property #grouping to sort layer objects in the wanted order for rendering
     * The #grouping property is the method name that is called on layer objects.
     * If both layers have same group, they are ordered by layer.getName()
     * @private
     * @param {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object} a comparable layer 1
     * @param {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object} b comparable layer 2
     * @param {String} groupingMethod method name to sort by
     */
    _layerListComparator (a, b, groupingMethod) {
        var nameA = a[groupingMethod]().toLowerCase();
        var nameB = b[groupingMethod]().toLowerCase();
        if (nameA === nameB && (a.getName() && b.getName())) {
            nameA = a.getName().toLowerCase();
            nameB = b.getName().toLowerCase();
        }
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
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

    addLayer (id) {
        if (!id || this.state.selectedLayerIds.includes(id)) {
            return;
        }
        const selectedLayerIds = [...this.state.selectedLayerIds, id];
        this.updateState({ selectedLayerIds });
        setTimeout(() => this.sandbox.postRequestByName('AddMapLayerRequest', [id]), 400);
    }

    removeLayer (id) {
        const index = this.state.selectedLayerIds.indexOf(id);
        if (index === -1) {
            return;
        }
        const selectedLayerIds = [...this.state.selectedLayerIds];
        selectedLayerIds.splice(index, 1);
        this.updateState({ selectedLayerIds });
        setTimeout(() => this.sandbox.postRequestByName('RemoveMapLayerRequest', [id]), 400);
    }

    updateLayerGroups () {
        const { searchText, activeId: filterId } = this.filter;
        const layers = filterId ? this.mapLayerService.getFilteredLayers(filterId) : this.mapLayerService.getAllLayers();
        let groups = this._getLayerGroups([...layers], this.groupingMethod);
        if (!searchText) {
            this.updateState({ groups });
            return;
        }
        const textSearchResults = groups.map(group => {
            const layers = group.getLayers()
                .filter(lyr => group.matchesKeyword(lyr.getId(), searchText));
            return { group, layers };
        }).filter(result => result.layers.length !== 0);
        this.updateState({ groups: textSearchResults });
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

    _createEventHandlers () {
        const sandbox = Oskari.getSandbox();
        const handlers = {
            MapLayerEvent: event => {
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
                    this._throttleLayerRefresh();
                }
            },
            AfterMapLayerRemoveEvent: () => this._throttleLayerSelection(),
            AfterMapLayerAddEvent: () => this._throttleLayerSelection(),
            'BackendStatus.BackendStatusChangedEvent': event => this._refreshLayer(event.getLayerId())
        };
        Object.getOwnPropertyNames(handlers).forEach(p => sandbox.registerForEventByName(this, p));
        return handlers;
    }

    _refreshLayer (id) {
        if (!id || this.state.groups.length === 0) {
            return;
        }
        const groups = this.state.groups.map(group => {
            const layer = group.getLayers().find(lyr => lyr.getId() === id);
            if (!layer) {
                return group;
            }
            return this._cloneGroup(group);
        });
        this.updateState({ groups });
    }
    _refreshAllLayers () {
        if (this.state.groups.length === 0) {
            return;
        }
        // Clone all groups and layers to ensure rerendering.
        const groups = this.state.groups.map(this._cloneGroup);
        this.updateState({ groups });
    }
    _cloneGroup (group) {
        let groupClone = Object.assign(Object.create(group), group);
        groupClone.layers = groupClone.layers.map(lyr => Object.assign(Object.create(lyr), lyr));
        return groupClone;
    }
}

export const CollapseService = mutatorMixin(Service, [
    'addLayer',
    'removeLayer',
    'updateOpenGroupTitles',
    'updateLayerGroups',
    'updateSelectedLayerIds',
    'showLayerMetadata',
    'showLayerBackendStatus'
]);
