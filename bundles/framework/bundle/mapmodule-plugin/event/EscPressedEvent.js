/**
 * @class Oskari.mapframework.bundle.mapmodule.event.EscPressedEvent
 * 
 * Event is sent when ESC key in keyboard is pressed so bundles can react to it.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.event.EscPressedEvent', 
/**
 * @method create called automatically on construction
 * @static
 */
function() {
}, {
    /** @static @property __name event name */
    __name : "EscPressedEvent",
    /**
     * @method getName
     * @return {String} the name for the event 
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
