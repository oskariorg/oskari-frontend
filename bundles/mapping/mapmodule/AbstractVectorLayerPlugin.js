import { FEATURE_QUERY_ERRORS } from './domain/constants';
import './AbstractMapLayerPlugin';

const AbstractMapLayerPlugin = Oskari.clazz.get('Oskari.mapping.mapmodule.AbstractMapLayerPlugin');

/**
 * @class Oskari.mapping.mapmodule.AbstractVectorLayerPlugin
 * Common interface definition for plugins that handle vector layers
 */
export class AbstractVectorLayerPlugin extends AbstractMapLayerPlugin {
    /**
     * Override in actual plugins to returns features.
     *
     * Returns features that are currently on map filtered by given geometry and/or properties
     * {
     *   "[layer id]": {
     *      accuracy: 'extent',
     *      runtime: true,
     *      features: [{ geometry: {...}, properties: {...}}, ...]
     *   },
     *   ...
     * }
     * Runtime flag is true for features pushed with AddFeaturesToMapRequest etc and false/missing for features from WFS/OGC API sources.
     * For features that are queried from MVT-tiles we might not be able to get the whole geometry and since it's not accurate they will
     *  only get the extent of the feature. This is marked with accuracy: 'extent' and it might not even be the whole extent if the
     *  feature continues on unloaded tiles.
     * @param {Object} geojson an object with geometry and/or properties as filter for features. Geometry defaults to current viewport.
     * @param {Object} opts additional options to narrow feature collection
     * @returns {Object} an object with layer ids as keys with an object value with key "features" for the features on that layer and optional runtime-flag
     */
    getFeatures (geojson = {}, opts = {}) {
        // Plugins handling vector features should override this method.
        return {};
    }
    /**
     * Checks if there is a reason why features shouldn't be queried for layer
     * @param {Oskari.mapframework.domain.AbstractLayer} layer for checking if it should be queried
     * @returns error code as string if there is a reason for not getting features or null if everything is ok
     */
    detectErrorOnFeatureQuery (layer) {
        if (!layer) {
            return FEATURE_QUERY_ERRORS.NOT_SELECTED;
        }
        if (!layer.isVisible()) {
            return FEATURE_QUERY_ERRORS.HIDDEN;
        }
        if (!layer.isInScale()) {
            return FEATURE_QUERY_ERRORS.SCALE;
        }
        return null;
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
