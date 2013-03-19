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
    /**
     * @method setWmsName
     * @param {String} wmsName used to identify service
     */
    setWmsName : function(wmsName) {
        this._wmsName = wmsName;
    },
    /**
     * @method getWmsName
     * @return {String} wmsName used to identify service
     */
    getWmsName : function() {
        return this._wmsName;
    }
}, {
    "extend": ["Oskari.mapframework.domain.AbstractLayer"]
});