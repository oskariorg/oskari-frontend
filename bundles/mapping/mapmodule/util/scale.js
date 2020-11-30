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

export const getScalesFromOptions = (mapModule, options) => {
    const result = {
        min: options.minScale || -1,
        max: options.maxScale || -1
    };
    const scales = mapModule.getScaleArray();

    if (typeof options.minResolution === 'number') {
        const minZoom = mapModule.getZoomForResolution(options.minResolution);
        if (minZoom !== -1) {
            result.max = scales[minZoom];
        }
    }
    if (typeof options.maxResolution === 'number') {
        const maxZoom = mapModule.getZoomForResolution(options.maxResolution);
        if (maxZoom !== -1) {
            result.min = scales[maxZoom];
        }
    }
    const minZoom = options.minZoomLevel;
    if (typeof minZoom === 'number') {
        if (minZoom >= 0 && minZoom < mapModule.getMaxZoomLevel()) {
            result.max = scales[options.minZoomLevel];
        }
    }
    const maxZoom = options.maxZoomLevel;
    if (typeof maxZoom === 'number') {
        if (maxZoom >= 0 && maxZoom < mapModule.getMaxZoomLevel()) {
            result.min = scales[options.minZoomLevel];
        }
    }
    return result;
};
