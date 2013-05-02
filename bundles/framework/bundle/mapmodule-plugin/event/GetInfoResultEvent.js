/**
 * @class Oskari.mapframework.bundle.mapmodule.event.GetInfoResultEvent
 *
 * Event is sent when ESC key in keyboard is pressed so bundles can react to it.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.event.GetInfoResultEvent',
/**
 * @method create called automatically on construction
 * @static
 */
function(data, content) {
    this._data = data;
    this._content = content;
}, {
    /** @static @property __name event name */
    __name : "GetInfoResultEvent",
    /**
     * @method getName
     * @return {String} the name for the event
     */
    getName : function() {
        return this.__name;
    }

    /**
     * @method getData
     */
    getData : function() {
        return this._data;
    },

    /**
     * @method getContent
     */
    getContent : function() {
        return this._content;
    },
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.event.Event']
});
