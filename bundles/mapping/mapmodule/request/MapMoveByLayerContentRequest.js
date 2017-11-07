/**
 * @class Oskari.mapframework.bundle.mapmodule.request.MapMoveByLayerContentRequest
 * Requests map to move to location/scale where given layer has content
 *
 * Requests are build and sent through Oskari.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.request.MapMoveByLayerContentRequest',
/**
 * @method create called automatically on construction
 * @static
 *
 * @param {String}
 *            mapLayerId id of map layer used in
 * @param {boolean} zoomToExtent (optional) if true zooms map to layer extent, default false
 * Oskari.mapframework.service.MapLayerService
 */
function(mapLayerId, zoomToExtent) {
    this._creator = null;
    this._mapLayerId = mapLayerId;
    this._zoomToExtent = (zoomToExtent === true);
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
    },
    /**
     * @method getZoomToExtent
     * @return {Boolean} zoomToExtent
     * Oskari.mapframework.service.MapLayerService
     */
    getZoomToExtent : function() {
        return this._zoomToExtent;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.request.Request']
});