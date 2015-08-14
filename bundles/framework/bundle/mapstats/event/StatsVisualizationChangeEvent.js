/**
 * @class Oskari.mapframework.bundle.mapstats.event.StatsVisualizationChangeEvent
 * 
 * 
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapstats.event.StatsVisualizationChangeEvent',
/**
 * @method create called automatically on construction
 * @static
 * @param {Object} layer an Oskari layer for visualizing the stats.
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
    * @method getLayer
    * Returns the layer the new style should be applied to.
    * @return {Object}
    */
    getLayer: function() {
        return this._layer;
    },
    /**
     * @method getParams
     * Returns the params used to generate the new style.
     * @return {Object} 
     */
    getParams : function() {
        return this._params;
    }
}, {
    'protocol' : ['Oskari.mapframework.event.Event']
});