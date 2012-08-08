/**
 * @class Oskari.mapframework.event.common.AfterDisableMapKeyboardMovementEvent
 *
 * Triggers on requests for keyboard control on map to be disabled.
 * Opposite of
 * Oskari.mapframework.event.common.AfterEnableMapKeyboardMovementEvent
 * See Oskari.mapframework.request.common.DisableMapKeyboardMovementRequest
 */
Oskari.clazz.define('Oskari.mapframework.event.common.AfterDisableMapKeyboardMovementEvent',

/**
 * @method create called automatically on construction
 * @static
 */
function() {
    this._creator = null;
}, {
    /** @static @property __name event name */
    __name : "AfterDisableMapKeyboardMovementEvent",
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