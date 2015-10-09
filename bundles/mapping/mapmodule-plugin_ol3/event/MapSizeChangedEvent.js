/**
 * @class Oskari.mapframework.bundle.mapmodule.event.MapSizeChangedEvent
 *
 * Event is sent when the map div size is changed
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.event.MapSizeChangedEvent',
/**
 * @method create called automatically on construction
 * @static
 * @param {Number} width map div's width
 * @param {Number} height map div's height
 */
function(width, height) {
    this._width = width;
    this._height = height;
}, {
    /** @static @property __name event name */
    __name : "MapSizeChangedEvent",
    /**
     * @method getName
     * @return {String} the name for the event
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getWidth
     * @return {Number}
     */
    getWidth : function() {
        return this._width;
    },
    /**
     * @method getHeight
     * @return {Number}
     */
    getHeight : function() {
        return this._height;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.event.Event']
});