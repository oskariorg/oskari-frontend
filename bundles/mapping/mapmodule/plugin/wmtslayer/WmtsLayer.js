/**
 * @class Oskari.mapframework.wmts.domain.WmtsLayer
 *
 * MapLayer of type WMTS
 */
Oskari.clazz.define('Oskari.mapframework.wmts.domain.WmtsLayer', function () {
    this._layerType = 'WMTS';
}, {
    requiresDescribeLayer: function () {
        // requires tileMatrixSet to work properly
        return true;
    }
}, {
    extend: ['Oskari.mapframework.domain.AbstractLayer']
});
