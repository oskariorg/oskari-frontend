/**
 * @class Oskari.mapframework.event.common.AfterHideMapMarkerEvent
 *
 * Triggers on Oskari.mapframework.request.common.HideMapMarkerRequest
 * FIXME: propably an unnecessary step that could be handled with the request
 * directly
 */
Oskari.clazz.define('Oskari.mapframework.event.common.AfterHideMapMarkerEvent',
/**
 * @method create called automatically on construction
 * @static
 */
function() {
    this._creator = null;
}, {
    /** @static @property __name event name */
    __name : "AfterHideMapMarkerEvent",
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