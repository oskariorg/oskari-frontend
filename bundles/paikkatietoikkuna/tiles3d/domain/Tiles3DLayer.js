/**
 * @class Oskari.map3dtiles.bundle.tiles3d.domain.Tiles3DLayer
 *
 * 3D-tile tileset layer
 */
Oskari.clazz.define('Oskari.map3dtiles.bundle.tiles3d.domain.Tiles3DLayer',

    /**
     * @method create called automatically on construction
     * @static
     */

    function () {
        /* Layer Type */
        this._layerType = 'tiles3d';
    }, {

    }, {
        'extend': ['Oskari.mapframework.domain.AbstractLayer']
    });
