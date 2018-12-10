import olSourceVectorTile from 'ol/source/VectorTile';
import {oskariIdKey} from './FeatureUtil';
import {intersects} from 'ol/extent';
import unRenderFeatures from './unRenderFeatures';
import GeoJSONReader from 'jsts/org/locationtech/jts/io/GeoJSONReader';
import OL3Parser from 'jsts/org/locationtech/jts/io/OL3Parser';
import LinearRing from 'ol/geom/LinearRing';
import GeometryCollection from 'ol/geom/GeometryCollection';
import * as olGeom from 'ol/geom';
import RelateOp from 'jsts/org/locationtech/jts/operation/relate/RelateOp';

const reader = new GeoJSONReader();
const olParser = new OL3Parser();
olParser.inject(olGeom.Point, olGeom.LineString, LinearRing, olGeom.Polygon, olGeom.MultiPoint, olGeom.MultiLineString, olGeom.MultiPolygon, GeometryCollection);

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

    getFeaturesIntersectingGeom (geom) {
        const geomFilter = reader.read(geom);
        const envelope = geomFilter.getEnvelopeInternal();
        const extentMatch = this.getFeaturesIntersectingExtent([envelope.getMinX(), envelope.getMinY(), envelope.getMaxX(), envelope.getMaxY()], true);
        return extentMatch.filter(f => {
            return RelateOp.relate(geomFilter, olParser.read(f.getGeometry())).isIntersects();
        });
    }

    _getTileExtent (tile) {
        return this.getTileGrid().getTileCoordExtent(tile.getTileCoord());
    }
}
