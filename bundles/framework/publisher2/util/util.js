
export const isEmpty = (value) => {
    if (value === null) {
        return true;
    } else if (typeof value === 'undefined') {
        return true;
    } else if (Array.isArray(value)) {
        return !value.length;
    } else if (value.constructor === Object) {
        return !Object.keys(value).length;
    }
    return false;
};

/**
* Extends object recursive for keeping defaults array.
* @method _extendRecursive
* @private
*
* @param {Object} defaults the default extendable object
* @param {Object} extend extend object
*
* @return {Object} extended object
*/
export const mergeValues = (defaults, extend) => {
    if (isEmpty(extend)) {
        return defaults;
    } else if (isEmpty(defaults)) {
        return extend;
    } else if (Array.isArray(defaults)) {
        if (!Array.isArray(extend)) {
            // extension must be array also or the value is ignored
            return [ ...defaults ];
        }
        return [...defaults, ...extend];
    // } else if (extend.constructor && extend.constructor === Object) {
    } else if (extend.constructor === Object) {
        const newBranch = {
            ...defaults
        };
        Object.keys(extend).forEach(fromKey => {
            const fromValue = extend[fromKey];
            const isNewKey = isEmpty(defaults[fromKey]);
            if (isNewKey) {
                newBranch[fromKey] = fromValue;
            } else {
                newBranch[fromKey] = mergeValues(defaults[fromKey], fromValue);
            }
        });
        return newBranch;
    }
    return extend;
};
