/**
 * @class Oskari.mapframework.event.common.AfterEnableMapKeyboardMovementEvent
 *
 * Triggers on requests for keyboard control on map to be enabled.
 * Opposite of
 * Oskari.mapframework.event.common.AfterDisableMapKeyboardMovementEvent
 * See Oskari.mapframework.request.common.EnableMapKeyboardMovementRequest
 */
Oskari.clazz.define('Oskari.mapframework.event.common.AfterEnableMapKeyboardMovementEvent',

/**
 * @method create called automatically on construction
 * @static
 */
function() {
    this._creator = null;
}, {
    /** @static @property __name event name */
    __name : "AfterEnableMapKeyboardMovementEvent",
    /**
     * @method getName
     * @return {String} event name
     */
    getName : function() {
        return this.__name;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.event.Event']
});

/* Inheritance */