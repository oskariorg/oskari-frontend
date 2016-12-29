/**
 * @class Oskari.liikennevirasto.bundle.transport.selector.ShowBoundingBoxRequest
 * Requests a show bbox on the map
 *
 * Requests are build and sent through Oskari.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.liikennevirasto.bundle.transport.selector.ShowBoundingBoxRequest',
/**
 * @method create called automatically on construction
 * @static
 */
function(bbox) {
	this._bbox = bbox;
}, {
	/** @static @property __name request name */
    __name : "ShowBoundingBoxRequest",
    /**
     * @method getName
     * @return {String} request name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getBbox
     * @return {Object} bbox
     */
    getBbox : function() {
        return this._bbox;
    }
}, {
	/**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.request.Request']
});