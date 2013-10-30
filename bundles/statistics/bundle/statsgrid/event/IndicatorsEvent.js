/**
 * Sends data of the open indicators.
 * 
 * @class Oskari.statistics.bundle.statsgrid.event.IndicatorsEvent
 */
Oskari.clazz.define('Oskari.statistics.bundle.statsgrid.event.IndicatorsEvent',
/**
 * @method create called automatically on construction
 * @static
 */
function(_indicators) {
	this._indicators = _indicators;
}, {
    /**
     * @method getName
     * Returns event name
     * @return {String} The event name.
     */
    getName : function() {
        return "StatsGrid.IndicatorsEvent";
    },

    /**
     * Returns the open indicators.
     *
     * @method getIndicators
     * @return {Object/null} returns the open indicators
     */
    getIndicators: function() {
    	return this._indicators;
    }
}, {
    'protocol' : ['Oskari.mapframework.event.Event']
});