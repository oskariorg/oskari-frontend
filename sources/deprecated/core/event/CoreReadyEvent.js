/**
 * @class Oskari.mapframework.event.CoreInitFinishedEvent
 *
 * Triggers when Oskari core has finished initialization
 */
Oskari.clazz.define('Oskari.mapframework.event.CoreReadyEvent', 

/**
 * @method create called automatically on construction
 * @static
 */
function() {
}, {
    /** @static @property __name event name */
    __name : "CoreReadyEvent",
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
