/**
 * @class Oskari.liikennevirasto.bundle.lakapa.ClearBasketRequest
 * Requests a clears all from basket
 *
 * Requests are build and sent through Oskari.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.liikennevirasto.bundle.lakapa.ClearBasketRequest',
/**
 * @method create called automatically on construction
 * @static
 */
function() {
}, {
	/** @static @property __name request name */
    __name : "ClearBasketRequest",
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