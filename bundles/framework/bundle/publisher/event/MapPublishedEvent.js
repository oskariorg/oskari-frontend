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
 * @param {Number} width width for the new map
 * @param {Number} height height for the new map
 * @param {String} language language for the map
 */
function(mapId, width, height, language) {
    this._id = mapId;
    this._width = width;
    this._height = height;
    this._language = language;
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
    },
    /**
     * @method getWidth
     * Returns width for the published map
     * @return {Number}
     */
    getWidth : function() {
        return this._width;
    },
    /**
     * @method getHeight
     * Returns height for the published map
     * @return {Number}
     */
    getHeight : function() {
        return this._height;
    },
    /**
     * @method getLanguage
     * Returns language code for the language the user selected for the map
     * @return {String}
     */
    getLanguage : function() {
        return this._language;
    }
}, {
    /**
     * @property {String[]} protocol
     * @static
     */
    'protocol' : ['Oskari.mapframework.event.Event']
});
