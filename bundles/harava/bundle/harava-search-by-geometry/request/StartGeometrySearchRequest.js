/**
 * @class Oskari.harava.bundle.mapmodule.request.StartGeometrySearchRequest
 * Requests a start geometry search
 * 
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.harava.bundle.mapmodule.request.StartGeometrySearchRequest', 
/**
 * @method create called automatically on construction
 * @static
 * @param {String} search mode, supported modes are: point, line, polygon, regularPolygon, mapExtent and pan
 */
function(searchMode) {
    // start drawing new
    if (!this._searchModes[searchMode]) {
            throw "Unknown draw mode '" + searchMode + "'";
    }
    this._searchMode = searchMode;
}, {
	/** @static @property __name request name */
    __name : "StartGeometrySearchRequest",
    /**
     * @method getName
     * @return {String} request name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * Supported geometry types
     */
    _searchModes : {
        point : 'point',
        line : 'line',
        polygon : 'polygon',
    	regularPolygon: 'regularPolygon',
    	mapextent: 'mapextent',
    	pan: 'pan'
    },
    /**
     * @method getSearchMode
     * @return {String} search mode
     */
    getSearchMode : function() {
        return this._searchMode;
    }
}, {
	/**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.request.Request']
});