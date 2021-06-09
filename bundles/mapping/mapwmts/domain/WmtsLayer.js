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
    function () {
    // Internal id for this map layer
        this._WmtsMatrixSetId = null;
        this._tileURL = null;
        this._availableQueryFormats = [];
        /* Layer Type */
        this._layerType = 'WMTS';
    }, {
    /**
     * @method setTileUrl
     * @param {String} url
     */
        setTileUrl: function (url) {
            this._tileURL = url;
        },
        /**
     * @method getTileUrl
     * @return {String} url
     */
        getTileUrl: function () {
            if (!this._tileURL) {
                return this.getLayerUrl();
            }
            return this._tileURL;
        },
        /**
     * @method setWmtsMatrixSetId
     * @param {String} matrixSetId
     */
        setWmtsMatrixSetId: function (matrixSetId) {
            this._WmtsMatrixSetId = matrixSetId;
        },
        /**
     * @method getWmtsMatrixSetId
     * @return {String}
     */
        getWmtsMatrixSetId: function () {
            return this._WmtsMatrixSetId;
        }
    }, {
        'extend': ['Oskari.mapframework.domain.AbstractLayer']
    });
