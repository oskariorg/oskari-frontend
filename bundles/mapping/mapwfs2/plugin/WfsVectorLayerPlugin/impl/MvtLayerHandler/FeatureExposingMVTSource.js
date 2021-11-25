import olSourceVectorTile from 'ol/source/VectorTile';
import LinearRing from 'ol/geom/LinearRing';
import GeometryCollection from 'ol/geom/GeometryCollection';
import * as olGeom from 'ol/geom';

import GeoJSONReader from 'jsts/org/locationtech/jts/io/GeoJSONReader';
import OL3Parser from 'jsts/org/locationtech/jts/io/OL3Parser';
import RelateOp from 'jsts/org/locationtech/jts/operation/relate/RelateOp';

import { WFS_ID_KEY } from '../../../../../mapmodule/domain/constants';
import { getMVTFeaturesInExtent } from '../../../../../mapmodule/util/vectorfeatures/mvtHelper';

const reader = new GeoJSONReader();
const olParser = new OL3Parser();
olParser.inject(olGeom.Point, olGeom.LineString, LinearRing, olGeom.Polygon, olGeom.MultiPoint, olGeom.MultiLineString, olGeom.MultiPolygon, GeometryCollection);

/**
 * @class FeatureExposingMVTSource
 * MVT source that allows queries about loaded features. Uses OL internal APIs.
 */
export class FeatureExposingMVTSource extends olSourceVectorTile {
    /**
     * @method getPropsIntersectingGeom
     * Returns properties of features whose geometry intersects given GeoJson geometry
     * @param {String | Object} geom GeoJson format geometry object. Note: NOT feature, but feature's geometry
     * @return {Object[]} List of feature properties objects
     */
    getPropsIntersectingGeom (geom) {
        const geomFilter = reader.read(geom);
        const envelope = geomFilter.getEnvelopeInternal();
        const features = getMVTFeaturesInExtent([envelope.getMinX(), envelope.getMinY(),
            envelope.getMaxX(), envelope.getMaxY()], this, WFS_ID_KEY);
        const jstsGeomFeatures = features.map(feature => ({
            id: feature.get(WFS_ID_KEY),
            properties: feature.getProperties(),
            geometry: olParser.read(feature.getGeometry())
        }));
        return jstsGeomFeatures
            .filter(feature => RelateOp.relate(geomFilter, feature.geometry).isIntersects())
            .map(f => f.getProperties());
    }
}
