import { DESCRIBE_LAYER } from '../../domain/constants';
/**
 * @class Oskari.mapframework.domain.VectorLayer
 *
 * MapLayer of type Vector
 */
Oskari.clazz.define('Oskari.mapframework.domain.VectorLayer',

    /**
     * @method create called automatically on construction
     * @static
     */

    function () { /* style definition for this layer */
        this._sldspec = null;
        this._hoverOptions = null;
        /* Layer Type */
        this._layerType = 'VECTOR';
    }, {

        /**
         * @method setStyledLayerDescriptor
         * @param {Object} sld
         *
         * TODO: check type for param
         */
        setStyledLayerDescriptor: function (sld) {
            this._sldspec = sld;
        },
        /**
         * @method getStyledLayerDescriptor
         * @return {Object} sld
         *
         * TODO: check type for return value
         */
        getStyledLayerDescriptor: function () {
            return this._sldspec;
        },
        /**
         * @method setHoverOptions
         * @param {Object} options
         */
        setHoverOptions: function (options) {
            this._hoverOptions = options;
        },
        /**
         * @method getHoverOptions
         * @return {Object} options
         */
        getHoverOptions: function () {
            return this._hoverOptions;
        },
        /**
         * Override so DescribeLayer call isn't made for runtime vector layers with numeric ids
         * The layer follows AddMapLayerRequest process IF the layer has been added with the showLayer: true flag.
         * @returns always loaded status
         */
        getDescribeLayerStatus: function () {
            return DESCRIBE_LAYER.LOADED;
        }
    }, {
        'extend': ['Oskari.mapframework.domain.AbstractLayer']
    });
