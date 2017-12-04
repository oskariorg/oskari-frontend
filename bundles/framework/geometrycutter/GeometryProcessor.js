/**
 * @class Oskari.mapframework.ui.module.common.geometrycutter.GeometryProcessor
 */
Oskari.clazz.define('Oskari.mapframework.bundle.geometrycutter.GeometryProcessor', function () {
    this._reader = new jsts.io.GeoJSONReader();
    this._writer = new jsts.io.GeoJSONWriter();
    this._geomFactory = new jsts.geom.GeometryFactory();
}, {
    splitByLine: function (sourceFeature, drawnFeature) {
        var source = this._reader.read(sourceFeature.geometry);
        var drawn = this._reader.read(drawnFeature.geometry);
        var sourceType = source.getGeometryType();

        switch (sourceType) {
            case 'MultiPolygon':
            case 'Polygon':
                return this._polygonSplit(source, drawn);
            case 'MultiLineString':
            case 'LineString':
                return this._lineSplit(source, drawn);
            default:
                throw new Error('Unsupported split source geometry: ' + sourceType);
        }
    },
    _polygonSplit: function (sourceGeometry, drawnGeometry) {
        var linework = sourceGeometry.getBoundary().union(drawnGeometry);
        var polygonizer = new jsts.operation.polygonize.Polygonizer();
        polygonizer.add(linework);

        var polygons = polygonizer.getPolygons();
        var out = [];
        for (var i = polygons.iterator(), c = 0; i.hasNext(); c++) {
            var polygon = i.next();
            var point = polygon.getInteriorPoint();
            if (sourceGeometry.contains(point)) {
                out.push({
                    type: 'Feature',
                    geometry: this._writer.write(polygon),
                    properties: {
                        id: c
                    }
                });
            }
        }
        return out;
    },
    _lineSplit: function (sourceGeometry, drawnGeometry) {
        var splitted = sourceGeometry.difference(drawnGeometry);
        var parts = [];
        switch (splitted.getGeometryType()) {
            case 'LineString':
                parts.push(splitted);
                break;
            case 'MultiLineString':
                for (let i = 0; i < splitted.getNumGeometries(); i++) {
                    parts.push(splitted.getGeometryN(i));
                }
                break;
            default:
                throw new Error('Unsupported split geometry result!');
        }
        return parts.map(function (part, i) {
            return {
                type: 'Feature',
                geometry: this._writer.write(part),
                properties: {
                    id: i
                }
            }
        }, this);
    },
    clipByPolygon: function (sourceFeature, drawnFeature) {
        var source = this._reader.read(sourceFeature.geometry);
        var drawn = this._reader.read(drawnFeature.geometry);
        var diff;
        try {
            diff = source.difference(drawn);
        } catch (e) {
            return null;
        }
        return [{
            type: 'Feature',
            geometry: this._writer.write(diff),
            properties: {
                id: 0
            }
        }];
    }
}, {});
