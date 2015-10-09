/**
 * Used to notify StatsLayerPlugin to remove hilight effect.
 * 
 * @class Oskari.statistics.bundle.statsgrid.event.ClearHilightsEvent
 */
Oskari.clazz.define('Oskari.statistics.bundle.statsgrid.event.ClearHilightsEvent',
/**
 * @method create called automatically on construction
 * @static
 */
function() {
}, {
    /**
     * @method getName
     * Returns event name
     * @return {String} The event name.
     */
    getName : function() {
        return "StatsGrid.ClearHilightsEvent";
    }
}, {
    'protocol' : ['Oskari.mapframework.event.Event']
});