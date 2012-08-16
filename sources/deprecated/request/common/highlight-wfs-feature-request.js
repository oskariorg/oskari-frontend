/**
 * @class Oskari.mapframework.request.common.HighlightWFSFeatureRequest
 * Requests the selected features to be highlighted on map
 * 
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.mapframework.request.common.HighlightWFSFeatureRequest',

/**
 * @method create called automatically on construction
 * @static
 *
 * @param {String}
 *            wfsFeatureId comma-separated list of featureIds with qnames
 * @param {String}
 *            mapLayerId id of the map layer (matching one in
 * Oskari.mapframework.service.MapLayerService)
 */
function(wfsFeatureId, mapLayerId) {
    this._creator = null;
    this._wfsFeatureId = wfsFeatureId;
    this._mapLayerId = mapLayerId;
}, {
    /** @static @property __name request name */
    __name : "HighlightWFSFeatureRequest",
    /**
     * @method getName
     * @return {String} request name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getWFSFeatureId
     * @return {String} comma-separated list of featureIds with qnames
     */
    getWFSFeatureId : function() {
        return this._wfsFeatureId;
    },
    /**
     * @method getMapLayerId
     * @return {String} id for map layer used in
     * Oskari.mapframework.service.MapLayerService
     */
    getMapLayerId : function() {
        return this._mapLayerId;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.request.Request']
});

/* Inheritance */