/**
 * @class Oskari.mapframework.bundle.mapmodule.event.ProgressEvent
 *
 * Event is sent when decides to
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.event.ProgressEvent',
/**
 * @method create called automatically on construction
 * @static
 */
function(status, id) {
    this._status = status;
    this._id = id;
}, {
    /** @static @property __name event name */
    __name : "ProgressEvent",
    /**
     * @method getName
     * @return {String} the name for the event
     */
    getName : function() {
        return this.__name;
    },
    getId: function(){
      return this._id;
    },
    getStatus: function(){
      return this._status;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.event.Event']
});
