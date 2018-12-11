export const oskariIdKey = '_oid';

const hiddenProps = new Set(['layer', oskariIdKey]);

function sortedFieldsFromProps (properties) {
    const fields = Object.keys(properties).filter(key => !hiddenProps.has(key));
    fields.sort();
    return fields;
}

function propsArrayFrom (properties, fields) {
    return [properties._oid].concat(fields.map(key => properties[key]));
}

export function propsAsArray (properties) {
    const fields = sortedFieldsFromProps(properties);
    return propsArrayFrom(properties, fields);
}

export function getFieldsAndPropsArrays (propsList) {
    if (!propsList.length) {
        return {fields: [], properties: []};
    }

    const fields = sortedFieldsFromProps(propsList[0]);

    const properties = propsList.map(properties => propsArrayFrom(properties, fields));

    fields.unshift('__fid');

    return {fields, properties};
}
