import olSourceVectorTile from 'ol/source/VectorTile';
import olRenderFeature from 'ol/render/Feature';
import { intersects } from 'ol/extent';
import LinearRing from 'ol/geom/LinearRing';
import GeometryCollection from 'ol/geom/GeometryCollection';
import * as olGeom from 'ol/geom';
import { fromKey as tileCoordFromKey } from 'ol/tilecoord';

import GeoJSONReader from 'jsts/org/locationtech/jts/io/GeoJSONReader';
import OL3Parser from 'jsts/org/locationtech/jts/io/OL3Parser';
import RelateOp from 'jsts/org/locationtech/jts/operation/relate/RelateOp';

import { WFS_ID_KEY } from '../../util/props';
import { convertRenderFeatures } from './convertRenderFeatures';

const reader = new GeoJSONReader();
const olParser = new OL3Parser();
olParser.inject(olGeom.Point, olGeom.LineString, LinearRing, olGeom.Polygon, olGeom.MultiPoint, olGeom.MultiLineString, olGeom.MultiPolygon, GeometryCollection);

/**
 * @class FeatureExposingMVTSource
 * MVT source that allows queries about loaded features. Uses OL internal APIs.
 */
export class FeatureExposingMVTSource extends olSourceVectorTile {
    /**
     * @method getFeaturePropsInExtent
     * Returns properties of features whose extent intersects with the given extent
     * @param {ol/extent | Number[]} extent requested extent [minx, miny, maxx, maxy]
     * @return {Object[]} List of feature properties objects
     */
    getFeaturePropsInExtent (extent) {
        const features = this._getDistinctFeatures(extent);
        return features.map(f => f.getProperties());
    }
    /**
     * @method getPropsIntersectingGeom
     * Returns properties of features whose geometry intersects given GeoJson geometry
     * @param {String | Object} geom GeoJson format geometry object. Note: NOT feature, but feature's geometry
     * @return {Object[]} List of feature properties objects
     */
    getPropsIntersectingGeom (geom) {
        const geomFilter = reader.read(geom);
        const envelope = geomFilter.getEnvelopeInternal();
        const features = this._getDistinctFeatures([envelope.getMinX(), envelope.getMinY(), envelope.getMaxX(), envelope.getMaxY()]);
        return features.map(feature => ({
            id: feature.get(WFS_ID_KEY),
            properties: feature.getProperties(),
            geometry: olParser.read(feature.getGeometry())
        }))
        .filter(feature => RelateOp.relate(geomFilter, feature.geometry).isIntersects())
        .map(f => f.getProperties());
    }
    /**
     * Returns all features in extent and gets rid of duplicates based on id (WFS_ID_KEY)
     * @private @method _getDistinctFeatures
     * @param {ol/extent | Number[]} extent requested extent [minx, miny, maxx, maxy]
     */
    _getDistinctFeatures (extent) {
        const featuresById = new Map();
        const features = this.getFeaturesInExtent(extent);
        // map will only hold one feature/id so we get get rid of duplicates
        features.forEach((feature) => {
            const id = feature.get(WFS_ID_KEY);
            if (typeof id !== 'undefined') {
                featuresById.set(id, feature);
            }
        });
        return Array.from(featuresById.values());
    }
    /**
     * @method _getRenderFeatureExtent
     * RenderFeature's extent might be in tile coordinates instead of projected map coordinates.
     * This helper method recalculates the feature's extent when it doesn't intersect with it's tile extent.
     *
     * @param {olRenderFeature} renderFeature
     * @param {ol/VectorTile} tile
     */
    _getRenderFeatureExtent (renderFeature, tile) {
        if (intersects(renderFeature.getExtent(), tile.extent)) {
            renderFeature.extent_ = null;
        }
        return renderFeature.getExtent();
    }
}
