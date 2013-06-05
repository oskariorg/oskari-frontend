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
     * @method setName
     * Sets name for the tool
     *
     * @param {String} name
     *            style name
     */
    setName : function(name) {
        this._name = name
    },

    /**
     * @method getName
     * Gets name for the tool
     *
     * @return {String} style name
     */
    getName : function() {
        return this._name;
    },

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