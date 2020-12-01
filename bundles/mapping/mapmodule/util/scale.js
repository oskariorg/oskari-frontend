function scaleValueUndefined (scale) {
    // undefined, null or -1 usually when undefined
    return typeof scale !== 'number' || scale < 0;
}

// assumes scales go from big to small as they do on mapmodule
function getZoomLevel (scale, scaleArray, defaultValue) {
    if (typeof scale !== 'number' || scale < 0) {
        return defaultValue;
    }
    const index = scaleArray.findIndex(s => scale >= s);
    if (index === -1) {
        return defaultValue;
    }
    return index;
};

export const getZoomLevelHelper = (mapScales) => {
    if (!mapScales || !Array.isArray(mapScales)) {
        throw new TypeError('Expects scales array as param');
    }
    const scaleArray = mapScales.slice(0);
    const getZoom = (scale) => getZoomLevel(scale, scaleArray, -1);
    return {
        getMinZoom: (minScale) => {
            return getZoom(minScale);
        },
        getMaxZoom: (maxScale) => {
            return getZoom(maxScale);
        },
        setOLZoomLimits: (olLayer, minScale, maxScale) => {
            const min = getZoom(minScale);
            if (min < 1) {
                olLayer.setMinZoom(-Infinity);
            } else {
                // OL: The minimum view zoom level (exclusive) above which this layer will be visible.
                // -1 for min because of exclusivity
                olLayer.setMinZoom(min - 1);
            }
            const max = getZoom(maxScale);
            if (max < 0 || max >= scaleArray.length) {
                olLayer.setMaxZoom(Infinity);
            } else {
                // OL: The maximum view zoom level (inclusive) at which this layer will be visible.
                olLayer.setMaxZoom(max);
            }
        }
    };
};

export const isInScale = (currentScale, minScale, maxScale) => {
    const maxOk = scaleValueUndefined(maxScale) || currentScale >= maxScale;
    const minOk = scaleValueUndefined(minScale) || currentScale <= minScale;
    // scale undefined or between min & max
    return maxOk && minOk;
};

/**
 * Parses minScale, maxScale, minResolution, maxResolution, minZoomLevel, maxZoomLevel from options
 * and returns an object with min and max keys having values of minScale and maxScale regardless of the input type
 *
 * - minScale, minZoom, maxResolution: how close _do you need to_ zoom to see the layer
 * - maxScale, maxZoom, minResolution: how close _can_ you zoom to _still_ see the layer
 */
export const getScalesFromOptions = (scales = [], resolutions = [], options = {}) => {
    const result = {
        // minScale == how close _do you need to_ zoom to see the layer
        min: options.minScale || -1,
        // maxScale == how close _can_ you zoom to _still_ see the layer
        max: options.maxScale || -1
    };
    
    const zoomHelper = getZoomLevelHelper(resolutions);

    // only set limits if they actually limit visibility (between 1 and max-1)
    if (typeof options.minResolution === 'number') {
        // how close _can_ you zoom to _still_ see the layer
        const maxZoom = zoomHelper.getMaxZoom(options.minResolution);
        if (maxZoom > 0 && maxZoom < scales.length -1) {
            result.max = scales[maxZoom];
        }
    }
    if (typeof options.maxResolution === 'number') {
        // how close _do you need to_ zoom to see the layer
        const minZoom = zoomHelper.getMinZoom(options.maxResolution);
        if (minZoom > 0 && minZoom < scales.length -1) {
            result.min = scales[minZoom];
        }
    }
    const minZoom = options.minZoomLevel;
    if (typeof minZoom === 'number') {
        if (minZoom > 0 && minZoom < scales.length -1) {
            // how close _do you need to_ zoom to see the layer
            result.min = scales[minZoom];
        }
    }
    const maxZoom = options.maxZoomLevel;
    if (typeof maxZoom === 'number') {
        if (maxZoom > 0 && maxZoom < scales.length -1) {
            // how close _can_ you zoom to _still_ see the layer
            result.max = scales[maxZoom];
        }
    }
    return result;
};
