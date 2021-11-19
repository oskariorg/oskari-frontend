

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
     * 
     * @param {Object} geojson geojson.geometry or geojson.properties can be used to filter features. Defaults to current viewport.
     * @param {Object} opts options for operation
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
