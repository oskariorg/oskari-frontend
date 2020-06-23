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
        this._layerType = 'arcgis93';
    }, {
        getQueryable: function () {
            // not sure why but previously the plugin called layer.setQueryable(true); when layer was added to the map
            // and this makes it more explicit
            return true;
        }
    }, {
        'extend': ['Oskari.mapframework.domain.AbstractLayer']
    });
