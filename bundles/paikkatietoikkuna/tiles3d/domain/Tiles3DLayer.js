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
        /**
         * @method getStyleDef
         * @param {String} styleName
         * @return {Object}
         */
        getStyleDef: function (styleName) {
            if (this._options && this._options.styles) {
                return this._options.styles[styleName];
            }
        },
        /**
         * @method getCurrentStyleDef
         * @return {Object}
         */
        getCurrentStyleDef: function () {
            if (this._currentStyle) {
                return this.getStyleDef(this._currentStyle.getName());
            }
        }
    }, {
        'extend': ['Oskari.mapframework.domain.AbstractLayer']
    });
