/**
 * @class Oskari.mapframework.ui.module.common.geometrycutter.GeometryProcessor
 */
Oskari.clazz.define('Oskari.mapframework.bundle.geometrycutter.GeometryProcessor', function () {
    this._reader = new jsts.io.GeoJSONReader();
    this._writer = new jsts.io.GeoJSONWriter();
}, {
    splitByLine: function(sourceFeature, drawnFeature) {
        var source = this._reader.read(sourceGeometry);
        var drawn = this._reader.read(drawnGeometry);

        switch (source.getGeometryType()) {
            case 'jsts.geom.Polygon':
                    // use polygonizer
                break;
            case 'jsts.geom.MultiPolygon':
                break;
            case 'jsts.geom.LineString':
                break;
            default:
                break;
        }
        

    },
    clipByPolygon: function(sourceFeature, drawnFeature) {
        var source = this._reader.read(sourceFeature.geometry);
        var drawn = this._reader.read(drawnFeature.geometry);
        var diff;
        try {
            diff = source.difference(drawn);
        } catch(e) {
            return null;
        }
        return [{
            type: 'Feature',
            geometry: this._writer.write(diff)
        }];
    }
}, {});
