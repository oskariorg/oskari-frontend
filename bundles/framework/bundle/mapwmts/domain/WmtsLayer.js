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
    this._WmtsLayerName = null;
    this._WmtsMatrixSet = null;

    // Description for layer
    this._WmtsUrls = [];

    /* Layer Type */
    this._layerType = "WMTS";
}, {
    /**
     * @method setWmtsName
     * @param {String} WmtsName used to identify service f.ex. in GetFeatureInfo queries.
     */
    setWmtsName : function(WmtsName) {
        this._WmtsName = WmtsName;
    },
    /**
     * @method getWmtsName
     * @return {String} wmsName used to identify service f.ex. in GetFeatureInfo queries.
     */
    getWmtsName : function() {
        return this._WmtsName;
    },
    /**
     * @method setWmtsMatrixSet
     * @return {Object} matrixSet
     */
    setWmtsMatrixSet : function(matrixSet) {
        this._WmtsMatrixSet = matrixSet;
    },
    /**
     * @method getWmtsMatrixSet
     * @return {Object}
     */
    getWmtsMatrixSet : function() {
        return this._WmtsMatrixSet;
    },
    /**
     * @method setWmtsLayerDef
     * @return {Object} def
     */
    setWmtsLayerDef : function(def) {
        this._WmtsLayerDef = def;
    },
    /**
     * @method getWmtsLayerDef
     * @return {Object}
     */
    getWmtsLayerDef : function() {
        return this._WmtsLayerDef;
    },
    /**
     * @method addWmtsUrl
     * @param {String} WmtsUrl
     * Apppends the url to layer array of wmts image urls
     */
    addWmtsUrl : function(WmtsUrl) {
        this._WmtsUrls.push(WmtsUrl);
    },
    /**
     * @method getWmtsUrls
     * @return {String[]} 
     * Gets array of layer wmts image urls
     */
    getWmtsUrls : function() {
        return this._WmtsUrls;
    },
    /**
     * @method getZoomOffset
     * @return {Number}
     */
    getZoomOffset: function() {
        return this._zoomOffSet;
    },
    /**
     * TODO: figure out some sensible way to set this.
     * We need to know the number of scales for the layer,
     * number of resolutions for the map and the sign of the zoom offset,
     * that is, should we drop the smallest or the largest scales.
     * Right now it's hard coded to 2.
     *
     * @method setZoomOffset
     * @param {Number} offSet
     */
    setZoomOffset: function(offSet) {
        this._zoomOffSet = 2;
    }
}, {
    "extend": ["Oskari.mapframework.domain.AbstractLayer"]
});
