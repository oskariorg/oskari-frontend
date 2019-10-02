const LAYER_TIMEOUT_MS = 400;

export class StateHandler {
    constructor () {
        this.listeners = [];
        this.selectedLayerIds = [];
        this.groups = [];
        this.mutatedGroups = null;
        this.filterKeyword = null;
        this.openGroupTitles = null;
        this.filtered = null;
        this.map = Oskari.getSandbox().getMap();
        this.mutator = this._createMutator();
        this.eventHandlers = this._createEventHandlers();
        this._throttleRefresh = Oskari.util.throttle(this._refreshAllLayers.bind(this), 2000, { leading: false });
    }
    /**
     * "Module" name for event handling
     */
    getName () {
        return 'LayerCollapseStateHandler';
    }
    updateStateWithProps ({ groups, selectedLayerIds, filterKeyword }) {
        this.groups = groups || this.groups;
        this.mutatedGroups = null;
        this.selectedLayerIds = selectedLayerIds || this.selectedLayerIds;
        if (!this._filterStateChanged(filterKeyword)) {
            this.notify();
            return;
        }
        this.filterKeyword = filterKeyword;
        this.filtered = this._getSearchResults();
        this.openGroupTitles = this.filtered
            ? this.filtered.map(result => result.group.getTitle()) : [];
        this.notify();
    }
    updateSelectedLayerIds () {
        this.selectedLayerIds = this.map.getLayers().map(layer => layer.getId());
        this.notify();
    }
    _filterStateChanged (nextFilterKeyword) {
        return this.filterKeyword !== nextFilterKeyword;
    }
    _getSearchResults () {
        if (!this.filterKeyword && this.filterKeyword !== 0) {
            return null;
        }
        const groups = this.mutatedGroups || this.groups;
        const results = groups.map(group => {
            const layers = group.getLayers()
                .filter(lyr => group.matchesKeyword(lyr.getId(), this.filterKeyword));
                // and some other rule?
            return { group, layers };
        }).filter(result => result.layers.length !== 0);
        return results;
    }
    addListener (listener) {
        this.listeners.push(listener);
    }
    _getState () {
        return {
            mutator: this.mutator,
            selectedLayerIds: this.selectedLayerIds,
            groups: this.mutatedGroups || this.groups,
            filtered: this.filtered,
            openGroupTitles: this.openGroupTitles,
            mapSrs: this.map.getSrsName()
        };
    }
    notify () {
        const state = this._getState();
        this.listeners.forEach(consumer => consumer(state));
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

    _createMutator () {
        const me = this;
        const sandbox = Oskari.getSandbox();
        return {
            addLayer (id) {
                if (!id || me.selectedLayerIds.includes(id)) {
                    return;
                }
                setTimeout(() => sandbox.postRequestByName('AddMapLayerRequest', [id]), LAYER_TIMEOUT_MS);
                me.selectedLayerIds.push(id);
                me.notify();
            },
            removeLayer (id) {
                const index = me.selectedLayerIds.indexOf(id);
                if (index === -1) {
                    return;
                }
                setTimeout(() => sandbox.postRequestByName('RemoveMapLayerRequest', [id]), LAYER_TIMEOUT_MS);
                me.selectedLayerIds.splice(index, 1);
                me.notify();
            },
            updateOpenGroupTitles (titles) {
                me.openGroupTitles = titles;
                me.notify();
            },
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
                sandbox.postRequestByName('catalogue.ShowMetadataRequest', [
                    { uuid },
                    subUuids.map(sub => ({ uuid: sub }))
                ]);
            },
            showLayerBackendStatus (layerId) {
                sandbox.postRequestByName('ShowMapLayerInfoRequest', [layerId]);
            }
        };
    }

    _createEventHandlers () {
        const sandbox = Oskari.getSandbox();
        const handlers = {
            MapLayerEvent: event => {
                const layerId = event.getLayerId();
                const operation = event.getOperation();

                if (operation === 'tool') {
                    if (layerId) {
                        this._refreshLayer(layerId);
                        return;
                    }
                    this._throttleRefresh();
                }
            }
        };
        Object.getOwnPropertyNames(handlers).forEach(p => sandbox.registerForEventByName(this, p));
        return handlers;
    }

    _refreshLayer (id) {
        if (!id || this.groups.length === 0) {
            return;
        }
        this.mutatedGroups = this.groups.map(group => {
            const layer = group.getLayers().find(lyr => lyr.getId() === id);
            if (!layer) {
                return group;
            }
            return this._cloneGroup(group);
        });
        this.filtered = this._getSearchResults();
        this.notify();
    }
    _refreshAllLayers () {
        if (this.groups.length === 0) {
            return;
        }
        // Clone all groups and layers to ensure rerendering.
        this.mutatedGroups = this.groups.map(this._cloneGroup);
        this.filtered = this._getSearchResults();
        this.notify();
    }
    _cloneGroup (group) {
        let groupClone = Object.assign(Object.create(group), group);
        groupClone.layers = groupClone.layers.map(lyr => Object.assign(Object.create(lyr), lyr));
        return groupClone;
    }
}
