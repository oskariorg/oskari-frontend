/**
 * @method hasPublishRight
 * Checks if the layer can be published.
 * @param
 * {Oskari.mapframework.domain.AbstractLayer} layer layer to check
 * @return {Boolean} true if the layer can be published
 */
export const hasPublishRight = layer => layer.hasPermission('publish');

export const isPublishable = layer => hasPublishRight(layer) && !layer.getVisibilityInfo().unsuported;

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
* Extends object recursively. Keeps defaults if extend doesnt' have a new value for primitive.
* Merges arrays by adding values from both default and extend.
* @method mergeValues
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
            return [...defaults];
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
