/**
 * @class Oskari.mapframework.bundle.mapanalysis.domain.AnalysisLayer
 *
 * MapLayer of type Analysis
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapanalysis.domain.AnalysisLayer',

/**
 * @method create called automatically on construction
 * @static
 */
function() {
    /* Layer Type */
    this._layerType = "ANALYSIS";
    
}, {
	/* Layer type specific functions */

    /**
     * @method setFields
     * Sets fields for the analysis
     *
     * @param {String} fields
     */
 	setFields : function(fields) {
 		this._fields = fields;
	},

    /**
     * @method getFields
     * Gets name for the tool
     *
     * @return {objArray} fields
     */
 	getFields : function() {
 		return this._fields;
	},

    /**
     * Sets the WPS url where the layer images are fetched from
     *
     * @method setWpsUrl
     * @param {String} url
     */
    setWpsUrl: function(url) {
        this._wpsUrl = url;
    },

    /**
     * Gets the WPS url
     *
     * @method getWpsUrl
     * @return {String} the url for wps service
     */
    getWpsUrl: function() {
        return this._wpsUrl;
    },

    /**
     * @method setWpsName
     * @param {String} wpsName used to identify service f.ex. in GetFeatureInfo queries.
     */
    setWpsName: function(wpsName) {
        this._wpsName = wpsName;
    },

    /**
     * @method getWpsName
     * @return {String} wpsName used to identify service f.ex. in GetFeatureInfo queries.
     */
    getWpsName : function() {
        return this._wpsName;
    },

    /**
     * @method setWpsLayerId
     * @param {String} wpsLayerId used to identify the right analysis result
     */
    setWpsLayerId: function(wpsLayerId) {
        this._wpsLayerId = wpsLayerId;
    },

    /**
     * @method getWpsLayerId
     * @return {String}
     */
    getWpsLayerId : function() {
        return this._wpsLayerId;
    }

}, {
    "extend": ["Oskari.mapframework.domain.AbstractLayer"]
});