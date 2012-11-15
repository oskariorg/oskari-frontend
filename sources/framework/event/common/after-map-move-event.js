/**
 * @class Oskari.framework.event.common.AfterMapMoveEvent
 *
 * Notifies application bundles that a map has moved.
 * See Oskari.mapframework.request.common.MapMoveRequest
 */
Oskari.clazz.define('Oskari.mapframework.event.common.AfterMapMoveEvent',

/**
 * @method create called automatically on construction
 * @static
 *
 * @param {Number} centerX
 *            longitude
 * @param {Number} centerY
 *            latitude
 * @param {Number} zoom
 *            map zoomlevel (0-12)
 * @param {Boolean} marker
 *            this should be removed, always sent as false
 * @param {Number} scale
 *            map scale
 */
function(centerX, centerY, zoom, marker, scale) {
    this._creator = null;

    this._centerX = centerX;
    this._centerY = centerY;
    this._zoom = zoom;
    this._marker = marker;
    this._scale = scale;
}, {
    /** @static @property __name event name */
    __name : "AfterMapMoveEvent",
    /**
     * @method getName
     * @return {String} event name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getCreator
     * @return {String} identifier for the event sender
     */
    getCreator : function() {
        return this._creator;
    },
    /**
     * @method getCenterX
     * @return {Number} longitude
     */
    getCenterX : function() {
        return this._centerX;
    },
    /**
     * @method getCenterY
     * @return {Number} latitude
     */
    getCenterY : function() {
        return this._centerY;
    },
    /**
     * @method getZoom
     * @return {Number} zoomlevel (0-12)
     */
    getZoom : function() {
        return this._zoom;
    },
    /**
     * @method getMarker
     * @return {Boolean} this should be removed, always set to false
     * @deprecated use Oskari.mapframework.sandbox.Sandbox.getMap() ->
     * Oskari.mapframework.domain.Map.isMarkerVisible()
     */
    getMarker : function() {
        return this._marker;
    },
    /**
     * @method getScale
     * @return {Number} map scale
     */
    getScale : function() {
        return this._scale;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.event.Event']
});

/* Inheritance */