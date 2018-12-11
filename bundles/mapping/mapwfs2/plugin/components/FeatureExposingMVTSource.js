import olSourceVectorTile from 'ol/source/VectorTile';
import {WFS_ID_KEY} from './propertyArrayUtils';
import {intersects} from 'ol/extent';
import convertRenderFeatures from './convertRenderFeatures';
import GeoJSONReader from 'jsts/org/locationtech/jts/io/GeoJSONReader';
import OL3Parser from 'jsts/org/locationtech/jts/io/OL3Parser';
import LinearRing from 'ol/geom/LinearRing';
import GeometryCollection from 'ol/geom/GeometryCollection';
import * as olGeom from 'ol/geom';
import RelateOp from 'jsts/org/locationtech/jts/operation/relate/RelateOp';
import {fromKey} from 'ol/tilecoord';

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

        this._applyInExtent(extent, feature => {
            const id = feature.get(WFS_ID_KEY);
            if (propertiesById.has(id)) {
                return;
            }
            propertiesById.set(id, feature.getProperties());
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

        let currentTile;
        let currentFeatures = [];
        const checkTileChanged = (tile) => {
            if (!currentTile) {
                currentTile = tile;
                return;
            }
            if (currentTile === tile) {
                return;
            }
            convertRenderFeatures(currentFeatures, currentTile, this).forEach(converted => {
                const convertedGeom = olParser.read(converted.getGeometry());
                if (RelateOp.relate(geomFilter, convertedGeom).isIntersects()) {
                    propertiesById.set(converted.get(WFS_ID_KEY), converted.getProperties());
                }
            });
            currentTile = tile;
            currentFeatures = [];
        };

        this._applyInExtent([envelope.getMinX(), envelope.getMinY(), envelope.getMaxX(), envelope.getMaxY()], (feature, tile) => {
            const id = feature.get(WFS_ID_KEY);
            if (propertiesById.has(id)) {
                return;
            }
            checkTileChanged(tile);

            currentFeatures.push(feature);
        });
        checkTileChanged();
        return Array.from(propertiesById.values());
    }
    /**
     * @private @method _applyInExtent
     * Calls given function for every feature whose extent intersects with the given extent
     * @param {ol/extent | Number[]} extent requested extent [minx, miny, maxx, maxy]
     * @param {Function} continuation called with matching feature as argument
     */
    _applyInExtent (extent, continuation) {
        const key = this.tileCache.peekFirstKey();
        const z = fromKey(key)[0]; // most recent zoom level in cache

        Object.values(this.sourceTiles_)
            .filter(tile => {
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
                features
                    .forEach(feature => {
                        if (!intersects(feature.getExtent(), extent)) {
                            return; // feature not in extent
                        }
                        continuation(feature, tile);
                    });
            });
    }
}
