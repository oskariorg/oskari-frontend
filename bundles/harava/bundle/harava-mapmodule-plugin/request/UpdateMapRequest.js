/**
 * @class Oskari.harava.bundle.mapmodule.request.UpdateMapRequest
 * Requests a update map
 * 
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.harava.bundle.mapmodule.request.UpdateMapRequest', 
/**
 * @method create called automatically on construction
 * @static
 */
function() {
	this._creator = null;
}, {
    /** @static @property __name request name */
	__name : "UpdateMapRequest",
    /**
     * @method getName
     * @return {String} request name
     */
	getName : function() {
		return this.__name;
	}
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
	'protocol' : ['Oskari.mapframework.request.Request']
});