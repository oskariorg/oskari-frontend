export const WFS_ID_KEY = '_oid';
export const WFS_FTR_ID_KEY = '__fid';

const hiddenProps = new Set(['layer', 'geometry', 'bbox', WFS_ID_KEY]);

function destructComplex (value) {
    if (typeof value === 'undefined') {
        return '';
    }
    return `${value}`;
}

function removeComplexPrefix (field) {
    return field.startsWith('$') ? field.substring(1) : field;
}
function sortedFieldsFromProps (properties) {
    const fields = Object.keys(properties).filter(key => !hiddenProps.has(removeComplexPrefix(key)));
    fields.sort((a, b) => removeComplexPrefix(a).localeCompare(removeComplexPrefix(b)));
    return fields;
}

function propsArrayFrom (properties, fields) {
    return [properties._oid].concat(fields.map(key => {
        const value = properties[key];
        if (key.startsWith('$')) {
            return destructComplex(value);
        }
        return value;
    }));
}

export function propsAsArray (properties) {
    const fields = sortedFieldsFromProps(properties);
    return propsArrayFrom(properties, fields);
}

export function getFieldsAndPropsArrays (propsList) {
    if (!propsList.length) {
        return { fields: [], properties: [] };
    }

    let fields = sortedFieldsFromProps(propsList[0]);
    const properties = propsList.map(properties => propsArrayFrom(properties, fields));

    fields = fields.map(removeComplexPrefix);
    fields.unshift('__fid');

    return { fields, properties };
}
