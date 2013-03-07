/**
 * @class Oskari.mapframework.bundle.featuredata.domain.WfsGridUpdateParams
 * 
 * Convenience class to store parameters for WFS Grid update scheduling
 */
Oskari.clazz.define('Oskari.mapframework.bundle.featuredata.domain.WfsGridUpdateParams',

/**
 * @method create called automatically on construction
 * @static
 *
 * @param {Oskari.mapframework.domain.WfsLayer} mapLayer
 *            wfs maplayer
 * 
 * @param {OpenLayers.Geometry} geometry
 *            map bounding box for selection
 * 
 * @param {Number} mapWidth
 *            width of map
 * 
 * @param {Number} mapHeight
 *            height of map
 * 
 * @param {Function} onReady
 *            function to call when operation is completed
 */
function(mapLayer, geometry, mapWidth, mapHeight, onReady) {

    this._geometry = geometry;

    this._mapWidth = mapWidth;

    this._mapHeight = mapHeight;

    this._mapLayer = mapLayer;

    this._onReady = onReady;
}, {
    /**
     * @method getMapLayer
     * Maplayer of type WFS
     *
     * @return {Oskari.mapframework.domain.WfsLayer}
     *            wfs map layer
     */
    getMapLayer : function() {
        return this._mapLayer;
    },
    /**
     * @method getGeometry
     * Map selection for query
     *
     * @return {OpenLayers.Geometry}
     *            map bounds
     */
    getGeometry : function() {
        return this._geometry;
    },
    /**
     * @method getMapWidth
     * Map width
     *
     * @return {Number}
     *            map width
     */
    getMapWidth : function() {
        return this._mapWidth;
    },
    /**
     * @method getMapHeight
     * Map height
     *
     * @return {Number}
     *            map height
     */
    getMapHeight : function() {
        return this._mapHeight;
    },
    /**
     * @method getCallback
     * @return {Function} function to call when operation is completed
     */
    getCallback : function() {
        return this._onReady;
    }
});
