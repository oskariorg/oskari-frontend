/**
 * @class Oskari.mapframework.wmts.domain.WmtsLayer
 *
 * MapLayer of type WMTS
 */
Oskari.clazz.define('Oskari.mapframework.wmts.domain.WmtsLayer',
/**
 * @method create called automatically on construction
 * @static
 */
function() {

    //Internal id for this map layer
    this._WmtsMatrixSetId = null;
    this._availableQueryFormats = [];
    /* Layer Type */
    this._layerType = "WMTS";
}, {
    /**
     * @method setWmtsMatrixSetId
     * @return {String} matrixSetId
     */
    setWmtsMatrixSetId : function(matrixSetId) {
        this._WmtsMatrixSetId = matrixSetId;
    },
    /**
     * @method getWmtsMatrixSetId
     * @return {String}
     */
    getWmtsMatrixSetId : function() {
        return this._WmtsMatrixSetId;
    },
    /**
     * Determines the URL that should be used for this layer
     * @return {String} URL for layer plugin
     */
    getUrl : function() {
        this.__determineUrlFunctions();
        return this._wmtsurl;
    },
    /**
     * Possible options for #setQueryFormat()
     * @method setAvailableQueryFormats
     * @param {String[]} options for GFI output
     */
    setAvailableQueryFormats: function (options) {

        this._availableQueryFormats = options || [];
    },
    /**
     * Possible options for #setQueryFormat()
     * @method getAvailableQueryFormats
     * @return {String[]} options for GFI output
     */
    getAvailableQueryFormats: function () {
        return this._availableQueryFormats || [];
    }
}, {
    "extend": ["Oskari.mapframework.domain.AbstractLayer"]
});
