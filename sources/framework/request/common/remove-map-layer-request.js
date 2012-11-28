/**
 * @class Oskari.mapframework.request.common.RemoveMapLayerRequest
 *
 * Requests for given map layer to be removed on map. Triggers a 
 * Oskari.mapframework.event.common.AfterMapLayerRemoveEvent.
 * Opposite of Oskari.mapframework.request.common.AddMapLayerRequest
 * 
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.mapframework.request.common.RemoveMapLayerRequest', 
/**
 * @method create called automatically on construction
 * @static
 *
 * @param {String}
 *            mapLayerId id of the map layer (matching one in Oskari.mapframework.service.MapLayerService)
 */
function(mapLayerId) {
    this._creator = null;
    this._mapLayerId = mapLayerId;
}, {
    /** @static @property __name request name */
    __name : "RemoveMapLayerRequest",
    /**
     * @method getName
     * @return {String} request name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getMapLayerId
     * @return {String} id for map layer used in Oskari.mapframework.service.MapLayerService
     */
    getMapLayerId : function() {
        return this._mapLayerId;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.request.Request']
});