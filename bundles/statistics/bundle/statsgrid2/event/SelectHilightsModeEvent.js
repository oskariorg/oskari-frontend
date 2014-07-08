/**
 * Used to notify StatsLayerPlugin to remove hilight effect.
 * 
 * @class Oskari.statistics.bundle.statsgrid.event.ClearHilightsEvent
 */
Oskari.clazz.define('Oskari.statistics.bundle.statsgrid.event.SelectHilightsModeEvent',
/**
 * @method create called automatically on construction
 * @static
 */
function(codes) {
	this._codes = codes;
}, {
    /**
     * @method getName
     * Returns event name
     * @return {String} The event name.
     */
    getName : function() {
        return "StatsGrid.SelectHilightsModeEvent";
    },
    /**
    * @method getCodes
    * Returns object literal of booleans with codes as keys.
    * @return {Object}
    */
    getCodes: function() {
        return this._codes;
    }

}, {
    'protocol' : ['Oskari.mapframework.event.Event']
});