/**
 * @class Oskari.mapframework.domain.VectorTileLayer
 *
 * MapLayer of type VectorTile
 */
Oskari.clazz.define('Oskari.mapframework.domain.VectorTileLayer',

    /**
     * @method create called automatically on construction
     * @static
     */

    function () { /* style definition for this layer */
        this.hoverOptions = null;

        /* Layer Type */
        this._layerType = 'VECTORTILE';
    }, {
        /**
         * @method setHoverOptions
         * @param {Object} options
         */
        setHoverOptions: function (options) {
            this.hoverOptions = options;
        },
        /**
         * @method getHoverOptions
         * @return {Object} options
         */
        getHoverOptions: function () {
            return this.hoverOptions;
        },
        /**
         * @method getStyleDef
         * @param {String} styleName
         * @return {Object}
         */
        getStyleDef(styleName) {
            if (this._options.style) {
                return this._options.style[styleName];
            }
        },
        /**
         * @method getCurrentStyleDef
         * @return {Object}
         */
        getCurrentStyleDef() {
            return this.getStyleDef(this._currentStyle.getName());
        }
    }, {
        'extend': ['Oskari.mapframework.domain.AbstractLayer']
    });
