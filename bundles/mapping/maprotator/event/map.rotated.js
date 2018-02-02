/**
 * @class Oskari.mapping.event.map.rotated'
 *  When map is rotated with ALT + SHIFT + MOUSE an event is sent out with how many degrees the map rotated
 */
Oskari.clazz.define('Oskari.mapping.event.map.rotated',

function( degrees ) {
    this.degrees = degrees;
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
      return this.degrees;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.event.Event']
});
