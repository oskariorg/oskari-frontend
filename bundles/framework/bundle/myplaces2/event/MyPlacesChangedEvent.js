/**
 * @method Oskari.mapframework.myplaces.event.MyPlacesChangedEvent
 * Tell components to reload myplaces data.
 */
Oskari.clazz.define('Oskari.mapframework.myplaces.event.MyPlacesChangedEvent', 

/**
 * @method create called automatically on construction
 * @static
 */
function(config) {
}, {
    /** @static @property __name event name */
    __name : "MyPlaces.MyPlacesChangedEvent",
    /**
     * @method getName
     * Returns event name
     * @return {String}
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