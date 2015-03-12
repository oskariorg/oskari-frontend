/**
 * @class Oskari.arcgis.bundle.maparcgis.domain.ArcGisLayer93
 *
 * MapLayer of type Arcgis
 */
Oskari.clazz.define('Oskari.arcgis.bundle.maparcgis.domain.ArcGis93Layer',

    /**
     * @method create called automatically on construction
     * @static
     */

    function () {
        /* Layer Type */
        this._layerType = "arcgis93";
    }, {

    }, {
        "extend": ["Oskari.mapframework.domain.AbstractLayer"]
    });