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
    this._WmtsMatrixSetData = null;
    this._WmtsLayerDef = null;

    /* Layer Type */
    this._layerType = "WMTS";
}, {
    /**
     * @method setWmtsName
     * @param {String} WmtsName used to identify service f.ex. in GetFeatureInfo queries.
     */
    setWmtsName : function(WmtsName) {
        this.setLayerName(WmtsName);
    },
    /**
     * @method getWmtsName
     * @return {String} wmsName used to identify service f.ex. in GetFeatureInfo queries.
     */
    getWmtsName : function() {
        return this.getLayerName();
    },
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
     * @method setWmtsMatrixSet
     * @return {Object} matrixSet
     */
    setWmtsMatrixSet : function(matrixSet) {
        this._WmtsMatrixSetData = matrixSet;
    },
    /**
     * @method getWmtsMatrixSet
     * @return {Object}
     */
    getWmtsMatrixSet : function() {
        return this._WmtsMatrixSetData;
    },
    /**
     * Usable in textarea etc
     * @method getWmtsMatrixSetAsString
     * @return {String}
     */
    getWmtsMatrixSetAsString : function() {
        var value = this.getWmtsMatrixSet();
        if(!value) {
            return "";
        }
        try {
            return JSON.stringify(value, null, 3);
        } catch(err) {
            return err;
        }
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
        this.addLayerUrl(WmtsUrl);
    },
    /**
     * @method getWmtsUrls
     * @return {String[]} 
     * Gets array of layer wmts image urls
     */
    getWmtsUrls : function() {
        return this.getLayerUrls();
    }
}, {
    "extend": ["Oskari.mapframework.domain.AbstractLayer"]
});
