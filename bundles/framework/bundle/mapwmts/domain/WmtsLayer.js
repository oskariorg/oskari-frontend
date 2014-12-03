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
    this._OriginalWmtsMatrixSetData = null;
    this._WmtsMatrixSet = null;
    this._WmtsLayerDef = null;
    this._availableQueryFormats = [];
    /* Layer Type */
    this._layerType = "WMTS";

    this._wmtsurl = null;
    this._requestEncoding = 'KVP';
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
     * @method setOriginalMatrixSetData
     * @return {String} matrixSetId
     */
    setOriginalMatrixSetData : function(matrixSetId) {
        this._OriginalWmtsMatrixSetData = matrixSetId;
    },
    /**
     * @method getOriginalMatrixSetData
     * @return {String}
     */
    getOriginalMatrixSetData : function() {
        return this._OriginalWmtsMatrixSetData;
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
     * Usable in textarea etc
     * @method getWmtsMatrixSetAsString
     * @return {String}
     */
    getOriginalWmtsMatrixSetAsString : function() {
        var value = this.getOriginalMatrixSetData();
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
     * Request encoding for layer plugin
     * @return {String} 'KVP' or 'REST'
     */
    getRequestEncoding : function() {
        this.__determineUrlFunctions();
        return this._requestEncoding;
    },
    /**
     * Determines the URL that should be used for this layer
     * @return {String} URL for layer plugin
     */
    __determineUrlFunctions : function() {
        if(this._wmtsurl) {
            return;
        }
        var layerDef = this.getWmtsLayerDef();
        if(layerDef && layerDef.resourceUrl && layerDef.resourceUrl.tile && layerDef.resourceUrl.tile.template) {
            this._wmtsurl =  layerDef.resourceUrl.tile.template;
            this._requestEncoding = 'REST';
        }
        else if(this.getLayerUrls().length > 0) {
            this._wmtsurl = this.getLayerUrls()[0];
            this._requestEncoding = 'KVP';
        }
        if(!this._wmtsurl) {
            // TODO: give some error to console?
        }
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
