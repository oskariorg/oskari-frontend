

import './AbstractMapLayerPlugin';
const AbstractMapLayerPlugin = Oskari.clazz.get('Oskari.mapping.mapmodule.AbstractMapLayerPlugin');

/**
 * @class Oskari.mapping.mapmodule.AbstractVectorLayerPlugin
 * Common interface definition for plugins that handle vector layers
 * 
 */

 export class AbstractVectorLayerPlugin extends AbstractMapLayerPlugin {
    constructor (config) {
        super(config);
    }

    /**
     * Override in actual plugins to returns features.
     * 
     * Returns features that are currently on map filtered by given geometry and/or properties
     * {
     *   "[layer id]": {
     *      runtime: true,
     *      features: [{ geometry: {...}, properties: {...}}, ...]
     *   },
     *   ...
     * }
     * Runtime flag is true for features pushed with AddFeaturesToMapRequest etc and false/missing for features from WFS/OGC API sources.
     * @param {Object} geojson an object with geometry and/or properties as filter for features. Geometry defaults to current viewport.
     * @param {Object} opts additional options to narrow feature collection
     * @returns {Object} an object with layer ids as keys with an object value with key "features" for the features on that layer and optional runtime-flag
     */
    getFeatures (geojson = {}, opts = {}) {
        // console.log('getting features from ', this.getName());
        return {};
    }
};

Oskari.clazz.defineES('Oskari.mapping.mapmodule.AbstractVectorLayerPlugin', AbstractVectorLayerPlugin,
    {
        protocol: [
            'Oskari.mapframework.module.Module',
            'Oskari.mapframework.ui.module.common.mapmodule.Plugin'
        ]
    }
);
