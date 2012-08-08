/**
 * @class Oskari.mapframework.bundle.mapwfs.domain.WfsTileRequest
 * 
 * TODO: desc
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapwfs.domain.WfsTileRequest',

/**
 * @method create called automatically on construction
 * @static
 *
 * Initial data on construction with
 * Oskari.clazz.create('Oskari.mapframework.domain.WfsTileRequest',
 * (here))
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
 * @param {String} creator
 *            what created this request
 * 
 * @param {Number} sequenceNumber
 *            incrementing number to detect async issues
 */
function(mapLayer, bbox, mapWidth, mapHeight, creator, sequenceNumber) {

    this._bbox = bbox;

    this._mapWidth = mapWidth;

    this._mapHeight = mapHeight;

    this._mapLayer = mapLayer;

    this._creator = creator;

    this._sequenceNumber = sequenceNumber;
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
     * @method getSequenceNumber
     * Incrementing number to detect async issues
     *
     * @return {Number}
     *            sequence number
     */
    getSequenceNumber : function() {
        return this._sequenceNumber;
    }
});
