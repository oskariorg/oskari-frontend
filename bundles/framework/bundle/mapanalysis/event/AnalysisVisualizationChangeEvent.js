/**
 * @class Oskari.mapframework.bundle.mapanalysis.event.AnalysisVisualizationChangeEvent
 * 
 * 
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapanalysis.event.AnalysisVisualizationChangeEvent',
/**
 * @method create called automatically on construction
 * @static
 * @param {Object} layer an Oskari layer for visualizing analysis.
 * @param {Object} params Params 
 */
function(layer, params) {
    this._layer = layer;
    this._params = params;
}, {
    /**
     * @method getName
     * Returns event name
     * @return {String} The event name.
     */
    getName : function() {
        return "MapAnalysis.AnalysisVisualizationChangeEvent";
    },
    /**
    * @method getLayer
    * Returns the layer with analyse.
    * @return {Object}
    */
    getLayer: function() {
        return this._layer;
    },
    /**
     * @method getParams
     * Returns the params used to generate the analyse.
     * @return {Object} 
     */
    getParams : function() {
        return this._params;
    }
}, {
    'protocol' : ['Oskari.mapframework.event.Event']
});