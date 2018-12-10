import olSourceVectorTile from 'ol/source/VectorTile';
import {oskariIdKey} from './FeatureUtil';
import {intersects} from 'ol/extent';
import unRenderFeatures from './unRenderFeatures';

export default class FeatureExposingMVTSource extends olSourceVectorTile {
    getFeaturesIntersectingExtent (extent, convertFeatures) {
        const featuresById = new Map();
        Object.values(this.sourceTiles_)
            .filter(tile => {
                const tileExtent = this._getTileExtent(tile);
                if (!intersects(tileExtent, extent)) {
                    return;
                }
                const features = tile.getFeatures();
                if (!features) {
                    return;
                }
                let matchingFeatures = features
                    .filter(f => intersects(f.getExtent(), extent));

                // TODO: optimize
                if (convertFeatures) {
                    matchingFeatures = unRenderFeatures(matchingFeatures, tile, this);
                }

                matchingFeatures
                    .forEach(f => {
                        featuresById.set(f.get(oskariIdKey), f);
                    });
            });

        return Array.from(featuresById.values());
    }

    _getTileExtent (tile) {
        return this.getTileGrid().getTileCoordExtent(tile.getTileCoord());
    }
}
