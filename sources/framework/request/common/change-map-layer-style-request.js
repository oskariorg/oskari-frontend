/**
 * @class Oskari.mapframework.request.common.ChangeMapLayerStyleRequest
 *
 * Changes style map layer with given id
 * 
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.mapframework.request.common.ChangeMapLayerStyleRequest',
/**
 * @method create called automatically on construction
 * @static
 *
 * @param {String}
 *            mapLayerId id of map layer used in
 * Oskari.mapframework.service.MapLayerService
 * @param {String}
 *            style name of the new style that should be selected from map layer
 */
function(mapLayerId, style) {
    this._creator = null;
    this._mapLayerId = mapLayerId;

    this._style = style;
}, {
    /** @static @property __name request name */
    __name : "ChangeMapLayerStyleRequest",
    /**
     * @method getName
     * @return {String} request name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getStyle
     * @return {String} requested style name
     */
    getStyle : function() {
        return this._style;
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