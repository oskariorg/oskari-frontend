const LAYER_TIMEOUT_MS = 360;

export class StateHandler {
    constructor () {
        this.listeners = [];
        this.selectedLayerIds = [];
        this.groups = [];
        this.filterKeyword = null;
        this.openGroupTitles = null;
        this.filtered = null;
        this.map = Oskari.getSandbox().getMap();
    }
    updateStateWithProps ({groups, selectedLayerIds, filterKeyword}) {
        this.groups = groups || this.groups;
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
        const results = this.groups.map(group => {
            const layers = group.getLayers()
                .filter(lyr => group.matchesKeyword(lyr.getId(), this.filterKeyword));
                // and some other rule?
            return {group, layers};
        }).filter(result => result.layers.length !== 0);
        return results;
    }
    addListener (listener) {
        this.listeners.push(listener);
    }
    _getState () {
        return {
            mutator: this.getMutator(),
            selectedLayerIds: this.selectedLayerIds,
            groups: this.groups,
            filtered: this.filtered,
            openGroupTitles: this.openGroupTitles,
            mapSrs: this.map.getSrsName()
        };
    }
    notify () {
        const state = this._getState();
        this.listeners.forEach(consumer => consumer(state));
    }
    getMutator () {
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
                    {uuid},
                    subUuids.map(sub => ({uuid: sub}))
                ]);
            },
            showLayerBackendStatus (layerId) {
                sandbox.postRequestByName('ShowMapLayerInfoRequest', [layerId]);
            }
        };
    }
}
