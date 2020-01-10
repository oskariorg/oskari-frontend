export const WFS_ID_KEY = '_oid';
export const WFS_FTR_ID_KEY = '__fid';
export const WFS_FTR_ID_LOCALE = 'ID';

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
    const fields = fieldsFromProps(properties);
    fields.sort((a, b) => removeComplexPrefix(a).localeCompare(removeComplexPrefix(b)));
    return fields;
}
function fieldsFromProps (properties) {
    return Object.keys(properties).filter(key => !hiddenProps.has(removeComplexPrefix(key)));
}

function propsArrayFrom (properties, fields) {
    return fields.map(key => {
        if (key === WFS_FTR_ID_KEY) {
            return properties[WFS_ID_KEY];
        }
        const value = properties[key];
        if (key.startsWith('$')) {
            return destructComplex(value);
        }
        return value;
    });
}

export function getFieldsArray (propsList) {
    if (!propsList.length) {
        return [];
    }
    let fields = fieldsFromProps(propsList[0]);
    fields = fields.map(removeComplexPrefix);
    fields.unshift(WFS_FTR_ID_KEY);
    return fields;
}

export function getPropsArray (propsList, fields) {
    if (!propsList.length) {
        return [];
    }
    return propsList.map(properties => propsArrayFrom(properties, fields));
}
