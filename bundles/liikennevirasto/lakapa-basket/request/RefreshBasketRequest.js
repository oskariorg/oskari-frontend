/**
 * @class Oskari.liikennevirasto.bundle.lakapa.RefreshBasketRequest
 * Requests a refresh all from basket
 *
 * Requests are build and sent through Oskari.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.liikennevirasto.bundle.lakapa.RefreshBasketRequest',
/**
 * @method create called automatically on construction
 * @static
 */
function() {
}, {
	/** @static @property __name request name */
    __name : "RefreshBasketRequest",
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