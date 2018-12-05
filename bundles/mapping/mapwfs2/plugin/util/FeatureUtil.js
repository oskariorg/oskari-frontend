export const oskariIdKey = '_oid';

const hiddenProps = new Set(['layer', oskariIdKey]);

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

export function getFieldsAndProperties (features) {
    if (!features.length) {
        return {fields: [], properties: []};
    }

    const fields = sortedFieldsFromFeature(features[0]);

    const properties = features.map(feature => propertiesFromFeatureFields(feature, fields));

    fields.unshift('__fid');

    return {fields, properties};
}
