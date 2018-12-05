import olSourceVectorTile from 'ol/source/VectorTile';
import {oskariIdKey} from './FeatureUtil';
import {intersects} from 'ol/extent';

export default class FeatureExposingMVTSource extends olSourceVectorTile {
    getFeaturesIntersecting (extent) {
        const featuresById = new Map();
        Object.values(this.sourceTiles_)
            .filter(tile => {
                const tileExtent = this._getTileExtent(tile);
                return intersects(tileExtent, extent);
            })
            .forEach(tile => {
                const features = tile.getFeatures();
                if (!features) {
                    return;
                }
                features
                    .filter(f => intersects(f.getExtent(), extent))
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
