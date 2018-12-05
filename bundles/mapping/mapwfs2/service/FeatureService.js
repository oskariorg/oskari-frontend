export const oskariIdKey = '_oid';

const hiddenProps = new Set(['layer', oskariIdKey]);

function getOskariId (feature) {
    return feature.get(oskariIdKey);
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

function sortedFieldsFromFeature (feature) {
    const fields = Object.keys(feature.getProperties()).filter(key => !hiddenProps.has(key));
    fields.sort();
    return fields;
}

function propertiesFromFeatureFields (feature, fields) {
    const properties = feature.getProperties();
    return [properties._oid].concat(fields.map(key => properties[key]));
}

export function propertiesFromFeature (feature) {
    const fields = sortedFieldsFromFeature(feature);
    return propertiesFromFeatureFields(feature, fields);
}

export class FeatureService {
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

        const fields = sortedFieldsFromFeature(features[0]);

        const properties = features.map(feature => propertiesFromFeatureFields(feature, fields));

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
