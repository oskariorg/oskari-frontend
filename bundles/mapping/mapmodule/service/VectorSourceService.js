
const LOG = Oskari.log('VectorSourceService');
/*
kohteiden valinta:
1) id:llä (kartan tai taulukon clickillä?)
2) propertyn arvon perusteella (ns. kohdetietotaulukossa/analyysissä suppilo / WFSSetPropertyFilter)
3) geometrialla (valintatyökalu / WFSSetFilter) -> Voisi tehdä niin, että geometrialla haetaan id:t joilla tehdään vasta "valinta"
*/
/**
 * Responsible for tracking selected features that are set by feature id/layer or filter that selected features from layers.
 */
class VectorSourceService {
    constructor (sandbox) {
        this.__name = 'VectorSourceService';
        this.__qname = 'Oskari.mapframework.service.VectorSourceService';
        this._featureSources = [];
        this._selectedFeaturesByLayer = {};
        this._filtersByLayer = {};
        this._sandbox = sandbox;
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
        features.push(id);
        this.__notifySelectionChange(layerId);
    }
    setSelectedFeatureIds (layerId, idList) {
        if (typeof layerId === 'undefined') {
            throw new Error('LayerId is required');
        }
        if (!Array.isArray(idList)) {
            throw new Error('idList should be an Array');
        }
        this._selectedFeaturesByLayer[layerId] = idList.slice(0);
        // TODO: check previous state and send event if selection was removed
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
            const previous = this._selectedFeaturesByLayer[layerId] || [];
            this._selectedFeaturesByLayer[layerId] = [];
            if (previous.length) {
                this.__notifySelectionChange(layerId);
            }
            return;
        }
        const previous = this._selectedFeaturesByLayer[layerId] || [];
        this._selectedFeaturesByLayer[layerId] = previous.filter(selectedId => id !== selectedId);
        if (previous.length !== this._selectedFeaturesByLayer[layerId].length) {
            this.__notifySelectionChange(layerId);
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
    /* ****************************************
     * Filter stuff
     * ****************************************
     */
    setSelectionFilterForLayer (layerId, filter) {
        if (typeof layerId === 'undefined') {
            throw new Error('LayerId is required');
        }
        const currentFeatures = this.__getFeaturesIdsForFilter(layerId);
        this._filtersByLayer[layerId] = filter;
        const updatedFeatures = this.__getFeaturesIdsForFilter(layerId);
        if (currentFeatures.length !== updatedFeatures.length) {
            // different amount selected -> notify
            this.__notifySelectionChange(layerId);
        } else if (updatedFeatures.length && currentFeatures.length) {
            // if there are selected features but size didn't change -> compare content
            const sameSelection = currentFeatures.every(item => updatedFeatures.includes(item));
            if (!sameSelection) {
                this.__notifySelectionChange(layerId);
            }
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
    /* ****************************************
     * Common stuff
     * ****************************************
     */
    __notifySelectionChange (layerId) {
        const layer = this._sandbox.findMapLayerFromSelectedMapLayers(layerId);
        const selectedFeatureIds = this.getSelectedFeatureIdsByLayer(layerId);
        const build = Oskari.eventBuilder('WFSFeaturesSelectedEvent');
        this._sandbox.notifyAll(build(selectedFeatureIds, layer));
    }
};
