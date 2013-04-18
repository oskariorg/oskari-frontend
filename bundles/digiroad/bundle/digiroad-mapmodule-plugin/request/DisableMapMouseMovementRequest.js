/**
 * @class Oskari.mapframework.bundle.mapmodule.request.DisableMapMouseMovementRequest
 *
 * Requests for mouse control on map to be disabled. 
 * Opposite of
 * Oskari.mapframework.bundle.mapmodule.request.EnableMapMouseMovementRequest
 * 
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.request.DisableMapMouseMovementRequest',

/**
 * @method create called automatically on construction
 * @static
 */
function() {
    this._creator = null;
}, {
    /** @static @property __name request name */
    __name : "DisableMapMouseMovementRequest",
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