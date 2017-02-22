/**
 * @class Oskari.liikennevirasto.bundle.transport.selector.ShowFeatureRequest
 * Requests a show feature on the map
 *
 * Requests are build and sent through Oskari.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.liikennevirasto.bundle.transport.selector.ShowFeatureRequest',
/**
 * @method create called automatically on construction
 * @static
 */
function(feature) {
	this._feature = feature;
}, {
	/** @static @property __name request name */
    __name : "ShowFeatureRequest",
    /**
     * @method getName
     * @return {String} request name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getFeature
     * @return {Object} feature
     */
    getFeature : function() {
        return this._feature;
    }
}, {
	/**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.request.Request']
});