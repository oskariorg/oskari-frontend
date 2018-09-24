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
        this._sldspec = null;

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
        }
    }, {
        'extend': ['Oskari.mapframework.domain.AbstractLayer']
    });
