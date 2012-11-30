/**
 * @class Oskari.mapframework.request.common.MapMoveRequest
 *
 * Requests for the map to move to given location and zoom level/bounds. 
 * Map sends out Oskari.mapframework.event.common.AfterMapMoveEvent after it has 
 * processed the request and the map has been moved. 
 * 
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.mapframework.request.common.MapMoveRequest',
/**
 * @method create called automatically on construction
 * @static
 *
 * @param {Number} centerX
 *            longitude
 * @param {Number} centerY
 *            latitude
 * @param {Number/OpenLayers.Bounds} zoom (optional)
 *            zoomlevel (0-12) or OpenLayers.Bounds to zoom to. If not given the map zoom level stays as it was.
 * @param {Boolean} marker
 *            true if map should add a marker to this location (optional, defaults to false)
 */
function(centerX, centerY, zoom, marker) {
    this._creator = null;

    this._centerX = centerX;

    this._centerY = centerY;

    this._zoom = zoom;

    this._marker = marker;

}, {
    /** @static @property {String} __name request name */
    __name : "MapMoveRequest",

    /**
     * @method getName
     * @return {String} request name
     */
    getName : function() {
        return this.__name;
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
     * @return {Number/OpenLayers.Bounds} zoomlevel (0-12) or OpenLayers.Bounds
     * to zoom to
     */
    getZoom : function() {
        return this._zoom;
    },
    /**
     * @method getMarker
     * @return {Boolean} true if map should add a marker to this location
     */
    getMarker : function() {
        return this._marker;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.request.Request']
});