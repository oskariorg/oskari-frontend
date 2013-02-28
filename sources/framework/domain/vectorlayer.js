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

function() { /* style definition for this layer */
    this._sldspec = null;

    /* Layer Type */
    this._layerType = "VECTOR";
}, {

    /**
     * @method setStyledLayerDescriptor
     * @param {Object} sld
     *
     * TODO: check type for param
     */
    setStyledLayerDescriptor: function(sld) {
        this._sldspec = sld;
    },
    /**
     * @method getStyledLayerDescriptor
     * @return {Object} sld
     *
     * TODO: check type for return value
     */
    getStyledLayerDescriptor: function() {
        return this._sldspec;
    }
}, {
    "extend": ["Oskari.mapframework.domain.AbstractLayer"]
});