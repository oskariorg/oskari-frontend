/**
 * @class Oskari.mapframework.bundle.mapmodule.request.RemoveMarkerRequest
 * 
 * Request to clear markers on the map.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.request.RemoveMarkerRequest', 

/**
 * @method create called automatically on construction
 * @static
 * 
 * @param {String[]} markerIdList 
 *      list of markers to remove (functionality not implemented yet) (optional)
 */
function(markerIdList) {
    this._list = markerIdList;
}, {
    /** @static @property __name request name */
    __name : "MapModulePlugin.RemoveMarkerRequest",
    /**
     * @method getName
     * @return {String} the name for the request 
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getMarkerIds
     * Returns array of markerIds to remove or null to remove all
     * @return {String[]} 
     */
    getMarkerIds : function() {
        return this._list;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.request.Request']
});
