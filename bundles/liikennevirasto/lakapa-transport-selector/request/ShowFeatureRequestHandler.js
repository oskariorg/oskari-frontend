/**
 * @class Oskari.liikennevirasto.bundle.transport.selector.ShowFeatureRequestHandler
 * Handles Oskari.liikennevirasto.bundle.transport.selector.ShowFeatureRequest.
 */
Oskari.clazz.define('Oskari.liikennevirasto.bundle.transport.selector.ShowFeatureRequestHandler', function(sandbox, plugin) {
    this.sandbox = sandbox;
    this.plugin = plugin;
}, {
	/**
	 * @method handleRequest 
	 * Add to basket
	 * @param {Oskari.mapframework.core.Core} core
	 * 		reference to the application core (reference sandbox core.getSandbox())
	 * @param {Oskari.liikennevirasto.bundle.transport.selector.ShowFeatureRequest} request
	 * 		request to handle
	 */
    handleRequest : function(core, request) {
    	var me = this;
        me.sandbox.printDebug("[Oskari.liikennevirasto.bundle.transport.selector.ShowFeatureRequest] Show feature on map");
        me.plugin.showFeatureOnMap(request.getFeature());
    }
}, {
	/**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    protocol : ['Oskari.mapframework.core.RequestHandler']
});
