/**
 * @class Oskari.mapframework.bundle.mapstats.domain.StatsLayer
 *
 * MapLayer of type Stats
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapstats.domain.StatsLayer',

/**
 * @method create called automatically on construction
 * @static
 */
function() {
    /* Layer Type */
    this._layerType = "STATS";
    
}, {
   /* Layer type specific functions */
}, {
    "extend": ["Oskari.mapframework.domain.AbstractLayer"]
});