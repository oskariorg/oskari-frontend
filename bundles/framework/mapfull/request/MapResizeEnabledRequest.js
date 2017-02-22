/**
 * @class Oskari.mapframework.bundle.mapfull.request.MapResizeEnabledRequest
 * Request enabling window resize
 *
 * Requests are build and sent through Oskari.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapfull.request.MapResizeEnabledRequest',
/**
 * @method create called automatically on construction
 * @static
 *
 * @param {Boolean}
 *            resizeEnabled boolean if window resizing is enabled
 */
function(resizeEnabled) {
    this._creator = null;
    this._resizeEnabled = resizeEnabled;

}, {
    /** @static @property __name request name */
    __name : "MapFull.MapResizeEnabledRequest",
    /**
     * @method getName
     * @return {String} request name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getPublishMode
     * @return {Boolean} boolean if window resizing is enabled
     */
    getResizeEnabled : function() {
        return this._resizeEnabled;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.request.Request']
});