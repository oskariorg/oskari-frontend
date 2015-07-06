/**
 * @class Oskari.mapframework.bundle.routingService.event.RouteSuccessEvent
 *
 * Used to notify routingUI that route has been got successfully from the service
 */
Oskari.clazz.define('Oskari.mapframework.bundle.routingService.event.RouteSuccessEvent',
/**
 * @method create called automatically on construction
 * @static
 * @param {JSON} geoJson route geometry as geoJson
 * @param {JSON} routeInstructions parameters of route as JSON
 */
function(geoJson, routeInstructions) {
    this._geoJson = geoJson;
    this._routeInstructions = routeInstructions;
}, {
    /** @static @property __name event name */
    __name : "RouteSuccessEvent",

    /**
     * @method getName
     * Returns event name
     * @return {String}
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getGeoJson
     * Returns the geoJson
     * @return {JSON}
     */
    getGeoJson : function() {
        return this._geoJson;
    },
    /**
     * @method getRouteInstructions
     * Returns instructions
     * @return {JSON}
     */
    getRouteInstructions : function() {
        return this._routeInstructions;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.event.Event']
});