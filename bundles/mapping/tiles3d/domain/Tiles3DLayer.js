import { createDefaultStyle } from '../../mapmodule/domain/VectorStyle';
/**
 * @class Oskari.mapframework.domain.Tiles3DLayer
 *
 * 3D-tile tileset layer
 */
Oskari.clazz.define('Oskari.mapframework.mapmodule.Tiles3DLayer',

    /**
     * @method create called automatically on construction
     * @static
     */

    function () {
        /* Layer Type */
        this._layerType = 'tiles3d';
    }, {
        /* override */
        // AbstractLayer selectStyle creates empty if style isn't found
        _createEmptyStyle: function () {
            return createDefaultStyle();
        },
        getQueryable: function () {
            // not sure why but previously the plugin called layer.setQueryable(false); when layer was added to the map
            // and this makes it more explicit
            return false;
        },
        /**
         * @method isSupported
         */
        isSupported: function () {
            return Oskari.getSandbox().getMap().getSupports3D();
        }
    }, {
        'extend': ['Oskari.mapframework.domain.AbstractLayer']
    });
