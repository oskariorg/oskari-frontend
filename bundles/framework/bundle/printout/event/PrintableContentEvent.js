/**
 * @class Oskari.clazz.define('Oskari.mapframework.bundle.printout.event.PrintableContentEvent
 * 
 * 
 */
Oskari.clazz.define('Oskari.mapframework.bundle.printout.event.PrintableContentEvent',
/**
 * @method create called automatically on construction
 * @static
 * @param {Object} layer
 *          an Oskari layer for visualizing the stats.
 * @param {Array[Object]} tileData
 *          Should be an array of BBOX-ImageURL infos (layer param required with this):
 *          [ { bbox: [<left>, <bottom>, <right>, <top>], url: "<image url>" }, ... ]
 * @param {Object} geojsonData
 */
function(contentId, layer, tileData, geojsonData) {
    this._contentId = contentId;
    this._layer = layer;
    this._tileData = tileData;
    this._geojsonData = geojsonData;
}, {
    /**
     * @method getName
     * Returns event name
     * @return {String} The event name.
     */
    getName : function() {
        return "Printout.PrintableContentEvent";
    },

    getContentId: function() {
        return this._contentId;
    },
    /**
    * Returns the layer the new style should be applied to.
    *
    * @method getLayer
    * @return {Object}
    */
    getLayer: function() {
        return this._layer;
    },
   /**
    * Sets the layer the new style should be applied to.
    *
    * @method setLayer
    * @param {Object} layer
    */
    setLayer: function(layer) {
        this._layer = layer;
    },
    /**
     * Returns the bbox-imageUrl array used to generate output
     *
     * @method getData
     * @return {Array[Object]} 
     */
    getTileData : function() {
        return this._tileData;
    },
    /**
     * @method setData
     * @param {Array[Object]} data [{ bbox: [l,b,r,t], url: "" }, ... ]
     */
    setTileData : function(data) {
       this._tileData = data;
    },
 /**
     * Returns the geojson data used to generate output
     *
     * @method getGeoJsonData
     * @return {Object} 
     */
    getGeoJsonData : function() {
        return this._geojsonData;
    },
    /**
     * @method setData
     * @param {Object} geojson
     */
    setGeoJsonData : function(data) {
       this._geojsonData = data;
    }
}, {
    'protocol' : ['Oskari.mapframework.event.Event']
});