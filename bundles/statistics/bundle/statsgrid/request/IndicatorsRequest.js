/**
 * Request to get open indicators.
 *
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 *
 * @class Oskari.statistics.bundle.statsgrid.request.IndicatorsRequest
 */
Oskari.clazz.define('Oskari.statistics.bundle.statsgrid.request.IndicatorsRequest', 
/**
 * @method create called automatically on construction
 * @static
 *
 */
function() {}, {
    /** @static @property __name request name */
    __name : "StatsGrid.IndicatorsRequest",
    /**
     * @method getName
     * @return {String} request name
     */
    getName : function() {
        return this.__name;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.request.Request']
});
