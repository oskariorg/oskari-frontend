/**
 * @class Oskari.statistics.bundle.statsgrid.event.StatsDataChangedEvent
 * 
 * 
 */
Oskari.clazz.define('Oskari.statistics.bundle.statsgrid.event.StatsDataChangedEvent',
/**
 * @method create called automatically on construction
 * @static
 * @param {Object} layer Thematic map layer (Oskari layer for visualizing the stats).
 * @param {Object} params Params should have keys for  CUR_COL, VIS_NAME, VIS_ATTR, VIS_CODES, COL_VALUES
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
        return "StatsGrid.StatsDataChangedEvent";
    },
    /**
    * @method getLayer
    * Returns Oskari layer.
    * @return {Object}
    */
    getLayer: function() {
        return this._layer;
    },
    /**
     * @method getParams
     * Returns the data for to create teh stats classifications.
     * @return {Object} 
     */
    getParams : function() {
        return this._params;
    }
}, {
    'protocol' : ['Oskari.mapframework.event.Event']
});