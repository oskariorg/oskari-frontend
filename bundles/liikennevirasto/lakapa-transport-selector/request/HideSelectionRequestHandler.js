/**
 * @class Oskari.liikennevirasto.bundle.transport.selector.HideSelectionRequestHandler
 * Handles Oskari.liikennevirasto.bundle.transport.selector.HideSelectionBoxRequest.
 */
Oskari.clazz.define('Oskari.liikennevirasto.bundle.transport.selector.HideSelectionRequestHandler', function(sandbox, plugin) {
    this.sandbox = sandbox;
    this.plugin = plugin;
}, {
	/**
	 * @method handleRequest
	 * Add to basket
	 * @param {Oskari.mapframework.core.Core} core
	 * 		reference to the application core (reference sandbox core.getSandbox())
	 * @param {Oskari.liikennevirasto.bundle.transport.selector.ShowBoundingBoxRequest} request
	 * 		request to handle
	 */
    handleRequest : function(core, request) {
    	var me = this;
        me.sandbox.printDebug("[Oskari.liikennevirasto.bundle.transport.selector.HideSelectionRequest] Hide selection");
        me.plugin.hideSelectionOnMap();
    }
}, {
	/**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    protocol : ['Oskari.mapframework.core.RequestHandler']
});
