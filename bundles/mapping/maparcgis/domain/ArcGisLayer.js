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
        this._layerType = 'arcgis';
    }, {
        getQueryable: function () {
            // not sure why but previously the plugin called layer.setQueryable(true); when layer was added to the map
            // and this makes it more explicit
            return true;
        }
    }, {
        'extend': ['Oskari.mapframework.domain.AbstractLayer']
    });
