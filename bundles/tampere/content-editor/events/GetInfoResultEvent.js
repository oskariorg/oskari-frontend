/**
 * @class Oskari.tampere.bundle.content-editor.event.GetInfoResultEvent
 *
 * Event is sent when ESC key in keyboard is pressed so bundles can react to it.
 */
Oskari.clazz.define('Oskari.tampere.bundle.content-editor.event.GetInfoResultEvent',
/**
 * @method create called automatically on construction
 * @static
 */
function(data, content) {
    this._data = data;
}, {
    /** @static @property __name event name */
    __name : "GetInfoResultEvent",
    /**
     * @method getName
     * @return {String} the name for the event
     */
    getName : function() {
        return this.__name;
    },

    /**
     * @method getData
     */
    getData : function() {
        return this._data;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.event.Event']
});
