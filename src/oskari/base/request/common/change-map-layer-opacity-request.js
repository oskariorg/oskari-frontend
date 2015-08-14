/**
 * @class Oskari.mapframework.request.common.ChangeMapLayerOpacityRequest
 * Requests opacity change for maplayer with given id
 * 
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.mapframework.request.common.ChangeMapLayerOpacityRequest',

/**
 * @method create called automatically on construction
 * @static
 *
 * @param {String}
 *            mapLayerId id for maplayer to be modified (Oskari.mapframework.service.MapLayerService)
 * @param {Number}
 *            opacity (0-100)
 */
function(mapLayerId, opacity) {
    this._creator = null;
    this._mapLayerId = mapLayerId;

    this._opacity = opacity;

}, {
    /** @static @property __name request name */
    __name : "ChangeMapLayerOpacityRequest",
    /**
     * @method getName
     * @return {String} request name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getOpacity
     * @return {Number} from 0 to 100 (0 = invisible)
     */
    getOpacity : function() {
        return this._opacity;
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