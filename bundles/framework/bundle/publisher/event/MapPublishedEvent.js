/**
 * @class Oskari.mapframework.bundle.publisher.event.MapPublishedEvent
 * 
 * Used to notify components that a new published map is available.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.publisher.event.MapPublishedEvent', 

/**
 * @method create called automatically on construction
 * @static
 * @param {Number} mapId id for the new map
 */
function(mapId) {
    this._id = mapId;
}, {
    /** @static @property __name event name */
    __name : "Publisher.MapPublishedEvent",
    /**
     * @method getName
     * Returns event name
     * @return {String}
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getId
     * Returns id for the published map
     * @return {Number}
     */
    getId : function() {
        return this._id;
    }
}, {
    /**
     * @property {String[]} protocol
     * @static
     */
    'protocol' : ['Oskari.mapframework.event.Event']
});
