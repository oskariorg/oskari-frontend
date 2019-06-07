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
         * @method getStyleDef
         * @param {String} styleName
         * @return {Object}
         */
        getExternalStyleDef: function (styleName) {
            if (this._options && this._options.externalStyles) {
                return this._options.externalStyles[styleName];
            }
        },
        /**
         * @method getCurrentStyleDefs
         * @return {Object}
         */
        getCurrentStyleDefs: function () {
            if (this._currentStyle) {
                const styleName = this._currentStyle.getName();
                const style = {
                    oskari: this.getStyleDef(styleName),
                    external: this.getExternalStyleDef(styleName)
                };
                return style;
            }
        }
    }, {
        'extend': ['Oskari.mapframework.domain.AbstractLayer']
    });
