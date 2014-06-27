/**
 * @class Oskari.arcgis.bundle.maparcgis.domain.ArcGisLayer
 *
 * MapLayer of type Arcgis
 */
Oskari.clazz.define('Oskari.arcgis.bundle.maparcgis.domain.ArcGisLayer',

    /**
     * @method create called automatically on construction
     * @static
     */

    function () {
        /* Layer Type */
        this._layerType = "arcgislayer";
    }, {

    }, {
        "extend": ["Oskari.mapframework.domain.AbstractLayer"]
    });