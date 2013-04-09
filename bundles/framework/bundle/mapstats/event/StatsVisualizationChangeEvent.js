/**
 * @class Oskari.mapframework.bundle.mapstats.event.StatsVisualizationChangeEvent
 * 
 * 
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapstats.event.StatsVisualizationChangeEvent',
/**
 * @method create called automatically on construction
 * @static
 * @param {Object} params Params should have keys for VIS_ID, VIS_NAME, VIS_ATTR, VIS_CLASSES, VIS_COLORS.
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
        return "MapStats.StatsVisualizationChangeEvent";
    },
    /**
    */
    getLayer: function() {
        return this._layer;
    },
    /**
     * @method getParams
     * 
     * @return {Object} 
     */
    getParams : function() {
        return this._params;
    }
}, {
    'protocol' : ['Oskari.mapframework.event.Event']
});