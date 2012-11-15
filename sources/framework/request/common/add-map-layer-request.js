/**
 * @class Oskari.mapframework.request.common.AddMapLayerRequest
 *
 * Requests for given map layer to be added on map. Opposite of 
 * Oskari.mapframework.request.common.RemoveMapLayerRequest
 * 
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.mapframework.request.common.AddMapLayerRequest',
/**
 * @method create called automatically on construction
 * @static
 *
 * @param {String}
 *            mapLayerId id of the map layer (matching one in Oskari.mapframework.service.MapLayerService)
 * @param {Boolean}
 *            keepLayersOrder should order of layers be reserved (optional,
 * defaults to false)
 * @param {Boolean}
 *            isBasemap (optional, defaults to false)
 * @param {Boolean}
 *            isExternal (optional, not used in paikkatietoikkuna)
 */
function(mapLayerId, keepLayersOrder, isBasemap, isExternal) {

    this._creator = null;
    this._mapLayerId = mapLayerId;
    this._keepLayersOrder = (keepLayersOrder == true);
    this._isExternal = (isExternal == true);
    this._isBasemap = (isBasemap == true);
}, {
    /** @static @property __name request name */
    __name : "AddMapLayerRequest",

    /**
     * @method getName
     * @return {String} request name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getMapLayerId
     * @return {String} id for map layer used in Oskari.mapframework.service.MapLayerService
     */
    getMapLayerId : function() {
        return this._mapLayerId;
    },
    /**
     * @method getKeepLayersOrder
     * @return {Boolean} boolean true if we should keep the layer order
     */
    getKeepLayersOrder : function() {
        return this._keepLayersOrder;
    },
    /**
     * @method isBasemap
     * @return {Boolean} boolean true if this is a basemap
     */
    isBasemap : function() {
        return this._isBasemap;
    },
    /**
     * @method isExternal
     * @return {Boolean} true if this is an externally added layer (not found in
     * MapLayerService?)
     */
    isExternal : function() {
        return this._isExternal;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.request.Request']
});