/**
 * @class Oskari.framework.bundle.featuredata.domain.WfsGridUpdateParams
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
 * @param {OpenLayers.Bounds} bbox
 *            map bounding box
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
function(mapLayer, bbox, mapWidth, mapHeight, onReady) {

    this._bbox = bbox;

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
     * @method getBbox
     * Map bounding box
     *
     * @return {OpenLayers.Bounds}
     *            map bounds
     */
    getBbox : function() {
        return this._bbox;
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
