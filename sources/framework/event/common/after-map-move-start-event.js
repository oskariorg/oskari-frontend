/**
 * @class Oskari.mapframework.event.common.MapMoveStartEvent
 *
 * Notifies application bundles that a map has began moving (is being dragged).
 * Oskari.mapframework.event.common.AfterMapMoveEvent is sent when dragging is
 * finished.
 */
Oskari.clazz.define('Oskari.mapframework.event.common.MapMoveStartEvent',
/**
 * @method create called automatically on construction
 * @static
 *
 * @param {Number} x
 *            longitude on drag start
 * @param {Number} y
 *            latitude on drag start
 */
function(x, y) {
    this._creator = null;
    this._x = x;

    this._y = y;

}, {

    /** @static @property __name event name */
    __name : "MapMoveStartEvent",
    /**
     * @method getName
     * @return {String} event name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getX
     * @return {Number} longitude on drag start
     */
    getX : function() {
        return this._x;
    },
    /**
     * @method getY
     * @return {Number} latitude on drag start
     */
    getY : function() {
        return this._y;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.event.Event']
});

/* Inheritance */