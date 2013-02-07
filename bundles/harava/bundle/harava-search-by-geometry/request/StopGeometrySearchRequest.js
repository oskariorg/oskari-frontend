/**
 * @class Oskari.harava.bundle.mapmodule.request.StopGeometrySearchRequest
 * Requests a stop geometry search
 * 
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.harava.bundle.mapmodule.request.StopGeometrySearchRequest', 

function() {
}, {
	/** @static @property __name request name */
    __name : "StopGeometrySearchRequest",
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