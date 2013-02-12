/**
 * @class Oskari.harava.bundle.mapmodule.request.AddWKTGeometryRequest
 * Requests to add geometry from wkt string.
 * 
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.harava.bundle.mapmodule.request.AddWKTGeometryRequest', 

function(wktString) {
    this._wktString = wktString;
}, {
	/** @static @property __name request name */
    __name : "AddWKTGeometryRequest",
    /**
     * @method getName
     * @return {String} request name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getWKTString
     * @return {String} wkt string
     */
    getWKTString : function() {
        return this._wktString;
    }
}, {
	/**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.request.Request']
});