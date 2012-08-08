/**
 * @class Oskari.mapframework.request.common.DisableMapKeyboardMovementRequest
 *
 * Requests for keyboard control on map to be disabled. This is usually requested
 * so that typing on a textfield doesn't move the map on the background.
 * Opposite of
 * Oskari.mapframework.request.common.EnableMapKeyboardMovementRequest
 * 
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.mapframework.request.common.DisableMapKeyboardMovementRequest',

/**
 * @method create called automatically on construction
 * @static
 */
function() {
    this._creator = null;
}, {
    /** @static @property __name request name */
    __name : "DisableMapKeyboardMovementRequest",
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

/* Inheritance */