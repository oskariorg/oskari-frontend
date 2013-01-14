/**
 * @class Oskari.mapframework.bundle.mapmodule.request.MapLayerVisibilityRequest
 * Requests visibility change for maplayer with given id
 * 
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapfull.request.MapPublishModeRequest',
/**
 * @method create called automatically on construction
 * @static
 *
 * @param {String}
 *            mapLayerId id of map layer used in Oskari.mapframework.service.MapLayerService
 * @param {Boolean}
 *            visible boolean if map layer should be visible or not
 */
function(publishMode) {
    this._creator = null;
    this._publishMode = publishMode;

}, {
    /** @static @property __name request name */
    __name : "MapFull.MapPublishModeRequest",
    /**
     * @method getName
     * @return {String} request name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getVisible
     * @return {Boolean} boolean if map layer should be visible or not
     */
    getPublishMode : function() {
        return this._publishMode;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.request.Request']
});