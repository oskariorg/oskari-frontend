const hiddenProps = new Set(['layer', '_oid']);

function getOskariId (feature) {
    return feature.getProperties()['_oid'];
}

class FeatureCache {
    constructor (layerId) {
        this.layerId = layerId;
        this.features = new Map();
    }
    addFeature (feature) {
        this.features.set(getOskariId(feature), feature);
    }
    getFeatures () {
        return Array.from(this.features.values());
    }
}

export default class FeatureService {
    constructor () {
        this.caches = new Map();
    }

    addFeatures (layerId, features) {
        if (!features.length) {
            return;
        }
        const cache = this._ensureCache(layerId);
        features.forEach(f => cache.addFeature(f));
    }

    getFieldsAndProperties (layerId) {
        const features = this._getFeatures(layerId);
        if (!features.length) {
            return {fields: [], properties: []};
        }

        const fields = Object.keys(features[0].getProperties()).filter(key => !hiddenProps.has(key));
        fields.sort();

        const properties = features.map(f => {
            const properties = f.getProperties();
            return [properties._oid].concat(fields.map(key => properties[key]));
        });

        fields.unshift('__fid');

        return {fields, properties};
    }

    _getFeatures (layerId) {
        const cache = this.caches.get(layerId);
        if (!cache) {
            return [];
        }
        return cache.getFeatures();
    }

    _ensureCache (layerId) {
        if (this.caches.has(layerId)) {
            return this.caches.get(layerId);
        }
        const cache = new FeatureCache(layerId);
        this.caches.set(layerId, cache);
        return cache;
    }
}
