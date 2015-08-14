/**
 * @class Oskari.mapframework.bundle.mapmodule.request.GetFeatureInfoRequest
 *
 * Requests for a get feature info for the given spot on the map to be shown.
 * 
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.request.GetFeatureInfoRequest', 

/**
 * @method create called automatically on construction
 * @static
 *
 * @param {Number}
 *            lon longitude
 * @param {Number}
 *            lat latitude
 * @param {Number}
 *            coordX mouseclick on map x coordinate (in pixels)
 * @param {Number}
 *            coordY mouseclick on map y coordinate (in pixels)
 */
function(lon, lat, coordX, coordY) {
    this._lon = lon;
    this._lat = lat;
    // mouse click position (in pixels)
    this._x = coordX;
    this._y = coordY;
}, {
    /** @static @property __name request name */
    __name : "MapModulePlugin.GetFeatureInfoRequest",
    /**
     * @method getName
     * @return {String} request name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getLon
     * @return {Number} longitude 
     */
    getLon : function() {
        return this._lon;
    },
    /**
     * @method getLat
     * @return {Number} latitude
     */
    getLat : function() {
        return this._lat;
    },
    /**
     * @method getX
     * @return {Number} mouseclick on map x coordinate (in pixels)
     */
    getX : function() {
        return this._x;
    },
    /**
     * @method getY
     * @return {Number} mouseclick on map y coordinate (in pixels)
     */
    getY : function() {
        return this._y;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.request.Request']
});