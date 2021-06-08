/**
 * @class Oskari.mapframework.domain.WmsLayer
 *
 * MapLayer of type WMS
 */
Oskari.clazz.define('Oskari.mapframework.domain.WmsLayer',

    /**
     * @method create called automatically on construction
     * @static
     */

    function () {
        this._layerType = 'WMS';
    }, {
    }, {
        'extend': ['Oskari.mapframework.domain.AbstractLayer']
    });
