/**
 * @class Oskari.mapframework.bundle.mapmodule.request.MapMoveByLayerContentRequest
 * Requests map to move to location/scale where given layer has content
 *
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.request.MapMoveByLayerContentRequest',
/**
 * @method create called automatically on construction
 * @static
 *
 * @param {String}
 *            mapLayerId id of map layer used in
 * Oskari.mapframework.service.MapLayerService
 */
function(mapLayerId) {
    this._creator = null;
    this._mapLayerId = mapLayerId;
}, {
    /** @static @property __name request name */
    __name : "MapModulePlugin.MapMoveByLayerContentRequest",
    /**
     * @method getName
     * @return {String} request name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getMapLayerId
     * @return {String} id for map layer used in
     * Oskari.mapframework.service.MapLayerService
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