import olSourceVectorTile from 'ol/source/VectorTile';
import {intersects} from 'ol/extent';
import LinearRing from 'ol/geom/LinearRing';
import GeometryCollection from 'ol/geom/GeometryCollection';
import * as olGeom from 'ol/geom';
import {fromKey as tileCoordFromKey} from 'ol/tilecoord';

import GeoJSONReader from 'jsts/org/locationtech/jts/io/GeoJSONReader';
import OL3Parser from 'jsts/org/locationtech/jts/io/OL3Parser';
import RelateOp from 'jsts/org/locationtech/jts/operation/relate/RelateOp';

import {WFS_ID_KEY} from './propertyArrayUtils';
import convertRenderFeatures from './convertRenderFeatures';

const reader = new GeoJSONReader();
const olParser = new OL3Parser();
olParser.inject(olGeom.Point, olGeom.LineString, LinearRing, olGeom.Polygon, olGeom.MultiPoint, olGeom.MultiLineString, olGeom.MultiPolygon, GeometryCollection);

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
     * @method getPropsIntersectingGeom
     * Returns properties of features whose geometry intersects given GeoJson geometry
     * @param {String | Object} geom GeoJson format geometry object. Note: NOT feature, but feature's geometry
     * @return {Object[]} List of feature properties objects
     */
    getPropsIntersectingGeom (geom) {
        const geomFilter = reader.read(geom);
        const envelope = geomFilter.getEnvelopeInternal();
        const propertiesById = new Map();

        this._applyInExtent([envelope.getMinX(), envelope.getMinY(), envelope.getMaxX(), envelope.getMaxY()], propertiesById, (features, tile) => {
            convertRenderFeatures(features, tile, this).forEach(converted => {
                const convertedGeom = olParser.read(converted.getGeometry());
                if (RelateOp.relate(geomFilter, convertedGeom).isIntersects()) {
                    propertiesById.set(converted.get(WFS_ID_KEY), converted.getProperties());
                }
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
