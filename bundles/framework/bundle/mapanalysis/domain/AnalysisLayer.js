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
  
}, {
    "extend": ["Oskari.mapframework.domain.AbstractLayer"]
});