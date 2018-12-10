import GeometryType from 'ol/geom/GeometryType';
import {linearRingIsClockwise} from 'ol/geom/flat/orient';
import LineString from 'ol/geom/LineString';
import MultiLineString from 'ol/geom/MultiLineString';
import MultiPoint from 'ol/geom/MultiPoint';
import MultiPolygon from 'ol/geom/MultiPolygon';
import Point from 'ol/geom/Point';
import Polygon from 'ol/geom/Polygon';
import GeometryLayout from 'ol/geom/GeometryLayout';
import Feature from 'ol/Feature';
import RenderFeature from 'ol/render/Feature';
import {equivalent, getTransform} from 'ol/proj';
import Units from 'ol/proj/Units';

const fakeGeometry = {
    flatCoordinates_: [],
    transform: RenderFeature.prototype.transform
};

function createTilePixelTransform (tileProjection, viewProjection) {
    return (coords) => {
        fakeGeometry.flatCoordinates_ = coords;
        fakeGeometry.transform(tileProjection, viewProjection);
        return coords;
    };
};

export default function unRenderFeatures (inputFeatures, tile, source) {
    const viewProjection = source.getProjection();
    if (!inputFeatures.length) {
        return [];
    }
    if (!(inputFeatures[0] instanceof RenderFeature)) {
        console.warn('Already feature!');
        return inputFeatures.slice();
    }

    const tileProjection = tile.getProjection();
    let transformer = null;
    if (!equivalent(tileProjection, viewProjection)) {
        if (tileProjection.getUnits() === Units.TILE_PIXELS) {
            // TODO: don't mutate
            tileProjection.setWorldExtent(source.getTileGrid().getTileCoordExtent(tile.getTileCoord()));
            tileProjection.setExtent(tile.getExtent());
            transformer = createTilePixelTransform(tileProjection, viewProjection);
        } else {
            transformer = getTransform(tileProjection, viewProjection);
        }
    }

    return inputFeatures.map((renderFeature) => {
        const id = renderFeature.getId();
        const values = renderFeature.getProperties();
        const ends = renderFeature.getEnds();
        const geometryType = renderFeature.getType();

        let flatCoordinates = renderFeature.getOrientedFlatCoordinates();
        if (transformer) {
            flatCoordinates = transformer(flatCoordinates.slice());
        }

        let geom;
        if (geometryType === GeometryType.POLYGON) {
            const endss = [];
            let offset = 0;
            let prevEndIndex = 0;
            for (let i = 0, ii = ends.length; i < ii; ++i) {
                const end = ends[i];
                if (!linearRingIsClockwise(flatCoordinates, offset, end, 2)) {
                    endss.push(ends.slice(prevEndIndex, i));
                    prevEndIndex = i;
                }
                offset = end;
            }
            if (endss.length > 1) {
                geom = new MultiPolygon(flatCoordinates, GeometryLayout.XY, endss);
            } else {
                geom = new Polygon(flatCoordinates, GeometryLayout.XY, ends);
            }
        } else {
            /* eslint-disable operator-linebreak */
            geom = geometryType === GeometryType.POINT ? new Point(flatCoordinates, GeometryLayout.XY) :
                geometryType === GeometryType.LINE_STRING ? new LineString(flatCoordinates, GeometryLayout.XY) :
                    geometryType === GeometryType.POLYGON ? new Polygon(flatCoordinates, GeometryLayout.XY, ends) :
                        geometryType === GeometryType.MULTI_POINT ? new MultiPoint(flatCoordinates, GeometryLayout.XY) :
                            geometryType === GeometryType.MULTI_LINE_STRING ? new MultiLineString(flatCoordinates, GeometryLayout.XY, ends) :
                                null;
        }
        const feature = new Feature();
        feature.setGeometry(geom);
        feature.setId(id);
        feature.setProperties(values);
        return feature;
    });
}
