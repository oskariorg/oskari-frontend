/*
Ways of selecting features:
1) By id
- clicking feature on map
- clicking feature row in object data table/grid
2) Through filter by property values
- filter icon on object data table/grid (WFSSetPropertyFilter?)
*/

/**
 * Compares two arrays to see if the contents match
 * @param {String[]} previous previous selection
 * @param {String[]} current current selection
 * @returns true if the content is the same
 */
const isSameContent = (previous = [], current = []) => {
    if (current.length !== previous.length) {
        // different amount selected -> notify
        return false;
    } else if (previous.length && current.length) {
        // if there are selected features but size didn't change -> compare content
        return current.every(item => previous.includes(item));
    }
    return true;
};

export const QNAME = 'Oskari.mapframework.service.VectorFeatureSelectionService';

/**
 * Responsible for tracking selected features that are set by feature id/layer or filter that selected features from layers.
 */
export class VectorFeatureSelectionService {
    constructor (sandbox) {
        this.__name = 'VectorFeatureSelectionService';
        this._featureSources = [];
        this._selectedFeaturesByLayer = {};
        this._filtersByLayer = {};
        this._sandbox = sandbox;
        sandbox.registerForEventByName(this, 'AfterMapLayerRemoveEvent');
        Oskari.makeObservable(this);
    }
    addSelectedFeature (layerId, id) {
        if (typeof layerId === 'undefined') {
            throw new Error('LayerId is required');
        }
        if (typeof id === 'undefined') {
            throw new Error('Feature id is required');
        }
        let features = this._selectedFeaturesByLayer[layerId];
        if (!features) {
            features = [];
            this._selectedFeaturesByLayer[layerId] = features;
        }
        if (!features.includes(id)) {
            const previousSelection = this.getSelectedFeatureIdsByLayer(layerId);
            features.push(id);
            this.__notifySelectionChange(layerId, previousSelection);
        }
    }
    setSelectedFeatureIds (layerId, idList) {
        if (typeof layerId === 'undefined') {
            throw new Error('LayerId is required');
        }
        if (!Array.isArray(idList)) {
            throw new Error('idList should be an Array');
        }
        const previousSelection = this.getSelectedFeatureIdsByLayer(layerId);
        this._selectedFeaturesByLayer[layerId] = idList.slice(0);
        const currentSelection = this.getSelectedFeatureIdsByLayer(layerId);

        if (!isSameContent(previousSelection, currentSelection)) {
            this.__notifySelectionChange(layerId, previousSelection);
        }
    }
    removeSelection (layerId, id) {
        if (typeof layerId === 'undefined' && typeof id === 'undefined') {
            // full reset
            Object.keys(this._selectedFeaturesByLayer)
                .forEach(layerId => this.removeSelection(layerId));
            return;
        }
        if (typeof layerId === 'undefined' && typeof id !== 'undefined') {
            // require layer id if feature id is requested
            throw new Error('LayerId is required');
        }
        if (typeof layerId !== 'undefined' && typeof id === 'undefined') {
            // clear all selected from single layer
            const previousSelection = this.getSelectedFeatureIdsByLayer(layerId);
            this._selectedFeaturesByLayer[layerId] = [];
            if (previousSelection.length) {
                this.__notifySelectionChange(layerId, previousSelection);
            }
            return;
        }
        const previousSelection = this.getSelectedFeatureIdsByLayer(layerId);
        this._selectedFeaturesByLayer[layerId] = previousSelection.filter(selectedId => id !== selectedId);
        if (previousSelection.length !== this._selectedFeaturesByLayer[layerId].length) {
            this.__notifySelectionChange(layerId, previousSelection);
        }
    }
    toggleFeatureSelection (layerId, featureId) {
        const selection = this.getSelectedFeatureIdsByLayer(layerId);
        if (selection.includes(featureId)) {
            this.removeSelection(layerId, featureId);
        } else {
            this.addSelectedFeature(layerId, featureId);
        }
    }
    getSelectedFeatureIdsByLayer (layerId) {
        if (typeof layerId === 'undefined') {
            return [];
        }
        const features = this._selectedFeaturesByLayer[layerId];
        if (features) {
            return features.slice(0);
        }
        return [];
    }

    getLayerIdsWithSelections () {
        // filter ids with empty arrays and convert to Number if possible
        return Object.keys(this._selectedFeaturesByLayer)
            .filter(id => this._selectedFeaturesByLayer[id].length)
            .map(layerId => isNaN(layerId) ? layerId : Number(layerId));
    }
    /* ****************************************
     * Might be worth it to get actual features (as GeoJSON) through this service instead of just ids
     * ****************************************
     */
    /*
    registerVectorFeatureSource(source) {
        if (typeof source === 'undefined') {
            throw new Error('Tried registering undefined source');
        }
        if (typeof source.getFeatureFromLayer !== 'function') {
            // for getting GeoJSON for feature id
            throw new Error('Source needs to implement getFeatureFromLayer()');
        }
        if (typeof source.getFeatures !== 'function') {
            // for filtering
            throw new Error('Source needs to implement getFeatures()');
        }
        this._featureSources.push(source);
    }
    getSelectedFeaturesByLayer (layerId) {
        if (typeof layerId === 'undefined') {
           return [];
        }
        const featuresIds = this.getSelectedFeatureIdsByLayer(layerId);
        const features = featuresIds
            .map(id => this.__findFeatureFromSources(layerId, id))
            .filter(item => !!item);
        return features;
    }
    __findFeatureFromSources (layerId, id) {
        let feature;
        this._featureSources.forEach(source => {
            if (!feature) {
                // only search sources if we haven't found it already
                feature = source.getFeatureFromLayer(layerId, id);
            }
        });
        return feature;
    }
    */
    /* ****************************************
     * Filter stuff - the idea is that selected features could change when
     *    map moves as more features are loaded in to viewport (and others are removed from it)
     *  NOTE! Not sure if this service should react to map moving or just store the filters
     * ****************************************
     */
    /*
    setSelectionFilterForLayer (layerId, filter) {
        if (typeof layerId === 'undefined') {
            throw new Error('LayerId is required');
        }
        const currentFeatures = this.__getFeaturesIdsForFilter(layerId);
        this._filtersByLayer[layerId] = filter;
        const updatedFeatures = this.__getFeaturesIdsForFilter(layerId);
        if (isSameContent(currentFeatures, updatedFeatures)) {
            // different amount selected -> notify
            this.__notifySelectionChange(layerId);
        }
        // TODO: on mapmove the selection should be compared for filter
        //   should save the previous selection by filter so we can compare it to new one?
    }
    __getFeaturesIdsForFilter (layerId) {
        let found = false;
        const filter = this._filtersByLayer[layerId];
        if (!filter) {
            // no filter
            return [];
        }
        return this._featureSources.flatMap(source => {
            if (found) {
                return;
            }
            // only search sources if we haven't found it already
            const features = source.getFeatures(layerId);
            if (typeof features !== 'undefined') {
                // source should return undefined in case it doesn't recognize layer
                found = true;
            }
            // TODO: apply filter
            return features; // return id, not feature
        });
    }
    */
    /* ****************************************
     * Notification/events and boilerplate
     * ****************************************
     */
    __notifySelectionChange (layerId, previousSelection) {
        const layer = this._sandbox.findMapLayerFromAllAvailable(layerId);
        const selectedFeatureIds = this.getSelectedFeatureIdsByLayer(layerId);
        const build = Oskari.eventBuilder('WFSFeaturesSelectedEvent');
        if (typeof build === 'function') {
            this._sandbox.notifyAll(build(selectedFeatureIds, layer, false));
        }
        this.trigger('change', [layerId, selectedFeatureIds, previousSelection]);
    }
    getName () {
        return this.__name;
    }
    getQName () {
        return QNAME;
    }
    /**
     * @public @method onEvent
     * Event is handled forwarded to correct #eventHandlers if found or
     * discarded* if not.
     *
     * @param {Oskari.mapframework.event.Event} event a Oskari event object
     */
    onEvent (event) {
        switch (event.getName()) {
        case 'AfterMapLayerRemoveEvent':
            if (event.getMapLayer().hasFeatureData()) {
                this.removeSelection(event.getMapLayer().getId());
            }
            break;
        }
    }
};
