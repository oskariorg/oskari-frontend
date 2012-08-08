/**
 * @class Oskari.mapframework.request.common.GetFeatureInfoRequest
 *
 * Requests for a get feature info for the clicked spot on the map to be shown.
 * Triggers a Oskari.mapframework.event.common.AfterGetFeatureInfoEvent.
 * 
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.mapframework.request.common.GetFeatureInfoRequest', 

/**
 * @method create called automatically on construction
 * @static
 *
 * @param {Mixed/Oskari.mapframework.domain.WmsLayer[]/Oskari.mapframework.domain.WfsLayer[]/Oskari.mapframework.domain.VectorLayer[]}
 *            mapLayers array of map layer objects, possible others than listed if additional maplayer types have been added by bundles
 * @param {Number}
 *            lon longitude
 * @param {Number}
 *            lat latitude
 * @param {Number}
 *            coordX mouseclick on map x coordinate (in pixels)
 * @param {Number}
 *            coordY mouseclick on map y coordinate (in pixels)  
 * @param {Number}
 *            mapWidth  map window width
 * @param {Number}
 *            mapHeight  map window height
 * @param {OpenLayers.Bounds}
 *            bbox   map window dimensions (as coordinates)
 * @param {String}
 *            srsProjectionCode  srs projection code
 */
function(mapLayers, lon, lat, coordX, coordY, mapWidth, mapHeight, bbox, srsProjectionCode) {
    this._creator = null;
    this._mapLayers = mapLayers;

    this._lon = lon;

    this._lat = lat;

    this._x = coordX;
    // mouse click position x (in pixels)
    this._y = coordY;
    //  mouse click position y (in pixels)
    this._mapWidth = mapWidth;
    // (in pixels)
    this._mapHeight = mapHeight;
    // (in pixels)
    this._bbox = bbox;
    // map dimensions (as coordinates)
    this._srs = srsProjectionCode;
    // map dimensions (as coordinates)

}, {
    /** @static @property __name request name */
    __name : "GetFeatureInfoRequest",
    /**
     * @method getName
     * @return {String} request name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getMapLayers
     * @return
     * {Mixed/Oskari.mapframework.domain.WmsLayer[]/Oskari.mapframework.domain.WfsLayer[]/Oskari.mapframework.domain.VectorLayer[]}
     *      mapLayers array of map layer objects, possible others than listed if
     * additional maplayer types have been added by bundles
     */
    getMapLayers : function() {
        return this._mapLayers;
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
    },
    /**
     * @method getMapWidth
     * @return {Number} map window width
     */
    getMapWidth : function() {
        return this._mapWidth;
    },
    /**
     * @method getMapHeight
     * @return {Number} map window height
     */
    getMapHeight : function() {
        return this._mapHeight;
    },
    /**
     * @method getBoundingBox
     * @return {OpenLayers.Bounds} map window dimensions (as coordinates)
     */
    getBoundingBox : function() {
        return this._bbox;
    },
    /**
     * @method getSRS
     * @return {String} srs projection code
     */
    getSRS : function() {
        return this._srs;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.request.Request']
});

/* Inheritance */