/**
 * @class Oskari.mapframework.ui.module.common.geometrycutter.GeometryProcessor
 */
Oskari.clazz.define('Oskari.mapframework.bundle.geometrycutter.GeometryProcessor', function () {
    this._reader = new jsts.io.GeoJSONReader();
    this._writer = new jsts.io.GeoJSONWriter();
}, {
    splitByLine: function(sourceGeometry, drawnGeometry) {
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
    clipByPolygon: function(sourceGeometry, drawnGeometry) {
        var source = this._reader.read(sourceGeometry);
        var drawn = this._reader.read(drawnGeometry);
        var diff;
        try {
            diff = source.difference(drawn);
        } catch(e) {
            // tolopogy exception
        }
        return [this._writer.write(diff)];
    }
}, {});
