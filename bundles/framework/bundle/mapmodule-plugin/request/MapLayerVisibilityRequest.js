/**
 * @class Oskari.framework.bundle.mapmodule.request.MapLayerVisibilityRequest
 * Requests visibility change for maplayer with given id
 * 
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.request.MapLayerVisibilityRequest',
/**
 * @method create called automatically on construction
 * @static
 *
 * @param {String}
 *            mapLayerId id of map layer used in Oskari.mapframework.service.MapLayerService
 * @param {Boolean}
 *            visible boolean if map layer should be visible or not
 */
function(mapLayerId, visible) {
    this._creator = null;
    this._mapLayerId = mapLayerId;
    this._visible = visible;

}, {
    /** @static @property __name request name */
    __name : "MapModulePlugin.MapLayerVisibilityRequest",
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
    },
    /**
     * @method getVisible
     * @return {Boolean} boolean if map layer should be visible or not
     */
    getVisible : function() {
        return this._visible;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.request.Request']
});