/**
 * @class Oskari.mapframework.bundle.mapmodule.event.RotationDegreesEvent
 *
 * Event is sent when decides to
 */
Oskari.clazz.define('Oskari.mapframework.framework.event.map.rotated',
/**
 * @method create called automatically on construction
 * @static
 */
function( degrees ) {
    this._degrees = degrees;
}, {
    /** @static @property __name event name */
    __name : "map.rotated",
    /**
     * @method getName
     * @return {String} the name for the event
     */
    getName : function() {
        return this.__name;
    },
    getRotationDegrees: function(){
      return this._degrees;
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
