export const WFS_ID_KEY = '_oid';
export const WFS_FTR_ID_KEY = '__fid';

const removeProps = new Set(['layer', 'geometry', 'bbox']);
const removePropsWithId = new Set([WFS_ID_KEY, WFS_FTR_ID_KEY, ...removeProps]);

function destructComplex (value) {
    if (typeof value === 'undefined') {
        return '';
    }
    return `${value}`;
}

function removeComplexPrefix (field) {
    return field.startsWith('$') ? field.substring(1) : field;
}

export function processFeatureProperties (properties = {}, removeId = false) {
    const remove = removeId ? removePropsWithId : removeProps;
    console.log(remove);
    return Object.fromEntries(
        Object.entries(properties)
            .filter(([key]) => !remove.has(removeComplexPrefix(key)))
            .map(entry => _processValue(entry)));
}

function _processValue ([key, value]) {
    if (key === WFS_ID_KEY) {
        return [WFS_FTR_ID_KEY, value];
    }
    if (key.startsWith('$')) {
        return [removeComplexPrefix(key), destructComplex(value)]; // TODO remove '$' from key??
    }
    return [key, value];
}
