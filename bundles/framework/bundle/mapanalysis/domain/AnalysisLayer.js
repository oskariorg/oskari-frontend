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
	}

}, {
    "extend": ["Oskari.mapframework.domain.AbstractLayer"]
});