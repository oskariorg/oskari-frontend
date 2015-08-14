/**
 * @class Oskari.mapframework.bundle.mapmyplaces.event.MyPlacesVisualizationChangeEvent
 * 
 * 
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmyplaces.event.MyPlacesVisualizationChangeEvent',
/**
 * @method create called automatically on construction
 * @static
 * @param {Object} Id of myplaces layer for visualizing changes in myplaces extra layers.
 * @param {boolean} forced redraw forced
 */
function(layerId, forced) {
    this._layerId = layerId;
    this._forced = forced;
}, {
    /**
     * @method getName
     * Returns event name
     * @return {String} The event name.
     */
    getName : function() {
        return "MapMyPlaces.MyPlacesVisualizationChangeEvent";
    },
    /**
    * @method getLayer
    * Returns  id of myplaces layer.
    * @return {Object}
    */
    getLayerId: function() {
        return this._layerId;
    },
    /**
     * @method isForced
     * Returns forced for redraw
     * @return {boolean}
     */
    isForced : function() {
        return this._forced;
    }
}, {
    'protocol' : ['Oskari.mapframework.event.Event']
});