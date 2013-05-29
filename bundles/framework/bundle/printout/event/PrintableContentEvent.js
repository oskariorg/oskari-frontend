/**
 * @class Oskari.clazz.define('Oskari.mapframework.bundle.printout.event.PrintableContentEvent
 * 
 * 
 */
Oskari.clazz.define('Oskari.mapframework.bundle.printout.event.PrintableContentEvent',
/**
 * @method create called automatically on construction
 * @static
 * @param {Object} layer an Oskari layer for visualizing the stats.
 * @param {Object} data Data should be a collection of BBOX-ImageURL infos
 */
function(layer, tileData, geojsonData) {
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
        return "Printout.PrintableContent";
    },
    /**
    * @method getLayer
    * Returns the layer the new style should be applied to.
    * @return {Object}
    */
    getLayer: function() {
        return this._layer;
    },
   /**
    * @method setLayer
    * Returns the layer the new style should be applied to.
    * @param {Object} layer
    */
    setLayer: function(layer) {
        this._layer = layer;
    },
    /**
     * @method getData
     * Returns the bbox-imageUrl array used to generate output
     * @return {Object} 
     */
    getTileData : function() {
        return this._tileData;
    },
    /**
     * @method setData
     * @param {Object} data [{ bbox: [l,b,r,t], url: "" }, ... ]
     */
    setTileData : function(data) {
       this._tileData = data;
    },
 /**
     * @method getGeoJsonData
     * Returns the geojson data used to generate output
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