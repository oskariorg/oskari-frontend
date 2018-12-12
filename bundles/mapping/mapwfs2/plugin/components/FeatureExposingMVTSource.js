import olSourceVectorTile from 'ol/source/VectorTile';
import {intersects} from 'ol/extent';
import {fromKey as tileCoordFromKey} from 'ol/tilecoord';

import {WFS_ID_KEY} from './propertyArrayUtils';

/**
 * @class FeatureExposingMVTSource
 * MVT source that allows queries about loaded features. Uses OL internal APIs.
 */
export default class FeatureExposingMVTSource extends olSourceVectorTile {
    /**
     * @method getFeaturePropsInExtent
     * Returns properties of features whose extent intersects with the given extent
     * @param {ol/extent | Number[]} extent requested extent [minx, miny, maxx, maxy]
     * @return {Object[]} List of feature properties objects
     */
    getFeaturePropsInExtent (extent) {
        const propertiesById = new Map();

        this._applyInExtent(extent, propertiesById, (features, tile) => {
            features.forEach((feature) => {
                propertiesById.set(feature.get(WFS_ID_KEY), feature.getProperties());
            });
        });

        return Array.from(propertiesById.values());
    }
    /**
     * @private @method _applyInExtent
     * Calls given function for every tile that has features whose extent intersects with the given extent
     * @param {ol/extent | Number[]} extent requested extent [minx, miny, maxx, maxy]
     * @param {Map} skipIds If feature id is found in this map, it is skipped
     * @param {Function} continuation called with matching features array & tile as arguments
     */
    _applyInExtent (extent, skipIds, continuation) {
        const key = this.tileCache.peekFirstKey();
        const z = tileCoordFromKey(key)[0]; // most recent zoom level in cache

        Object.values(this.sourceTiles_)
            .forEach(tile => {
                const tileCoord = tile.getTileCoord();
                if (z !== tileCoord[0]) {
                    return; // wrong zoom level
                }
                const tileExtent = this.getTileGrid().getTileCoordExtent(tileCoord);
                if (!intersects(tileExtent, extent)) {
                    return; // tile not in extent
                }
                const features = tile.getFeatures();
                if (!features) {
                    return;
                }
                const matching = features.filter(feature => {
                    const id = feature.get(WFS_ID_KEY);
                    if (skipIds.has(id)) {
                        return false;
                    }
                    return intersects(feature.getExtent(), extent);
                });
                if (!matching.length) {
                    return;
                }
                continuation(matching, tile);
            });
    }
}
