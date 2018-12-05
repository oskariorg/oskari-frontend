import olSourceVectorTile from 'ol/source/VectorTile';
import {oskariIdKey} from './FeatureUtil';

export default class FeatureExposingMVTSource extends olSourceVectorTile {
    getFeaturesIntersecting (extent) {
        const featuresById = new Map();
        Object.values(this.sourceTiles_).forEach(tile => {
            const features = tile.getFeatures();
            if (!features) {
                return;
            }
            features.forEach(f => {
                featuresById.set(f.get(oskariIdKey), f);
            });
        });

        return Array.from(featuresById.values());
    }
}
