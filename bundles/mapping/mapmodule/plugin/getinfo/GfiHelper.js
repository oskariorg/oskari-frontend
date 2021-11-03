import GeoJSON from 'ol/format/GeoJSON';

/**
 * Trying get GFI JSON
 * @method getGfiJSON
 * @param {Object} data
 * @returns {Object} returns object if data has JSON Object, other null
 */
const getGfiJSON = (data) => {
    try {
        if (typeof data === 'string') {
            const parsedJSON = JSON.parse(data);

            // Handle non-exception-throwing cases:
            if ((parsedJSON && typeof parsedJSON !== 'object') || !parsedJSON) {
                return null;
            }
            return parsedJSON;
        } else if (data && typeof data === 'object') {
            return data;
        }
        return null;
    } catch (e) {}
    return null;
};

/**
 * Checks at if data has GeoJSON
 * @method hasGeoJSON
 * @param {Object} data
 * @returns {Boolean} true if data has GeoJSON Object, other false
 */
const hasGeoJSON = (data) => {
    try {
        new GeoJSON().readFeatures(data);
    } catch (e) {
        return false;
    }
    return true;
};

/**
 * Checks at if feature has WMS gfi response
 * @method isWMSgfi
 * @param {Object} feature
 * @returns
 */
const isWMSgfi = (feature) => {
    return feature.type === 'wmslayer' &&
        ['presentationType', 'content', 'type'].every(key => !!feature[key]);
};

/**
 * Gets GFI response type
 * @method getGfiResponseType
 * @param {Object} feature
 * @returns {String} GFI response type (json, geojson or text)
 */
export const getGfiResponseType = (feature) => {
    if (isWMSgfi(feature)) {
        const isJSON = getGfiJSON(feature.content);
        if (isJSON) {
            if (hasGeoJSON(feature.content)) {
                return 'geojson';
            }
            return 'json';
        }
        return 'text';
    } else {
        // Content is WFS feature properties
        return 'json';
    }
};

/**
 * Gets GFI content
 * @method getGfiContent
 * @param {Object} feature
 * @returns GFI content
 */
export const getGfiContent = (feature) => {
    const gfiJSON = getGfiJSON(feature.content);
    if (gfiJSON) {
        return gfiJSON;
    } else if (typeof feature === 'object' && !feature.content && feature.content !== '') {
        return feature;
    }
    return feature.content;
};

/**
 * Check at if content has GFI data
 * @method hasGfiData
 * @param {Object} content
 * @param {String} type
 * @returns {Boolean} true if there is GFI content data
 */
export const hasGfiData = (content, type) => {
    const hasStringGfiData = typeof content === 'string' && content !== 'unknown' && content !== '';
    const hasGeoJsonGfiData = type === 'geojson' && content.features && content.features.length > 0;
    const hasJsonGfiData = type === 'json' && content !== '';
    if (hasStringGfiData ||
        hasGeoJsonGfiData ||
        hasJsonGfiData) {
        return true;
    }
    return false;
};
