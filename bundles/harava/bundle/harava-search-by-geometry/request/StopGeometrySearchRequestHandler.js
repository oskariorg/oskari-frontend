/**
 * @class Oskari.harava.bundle.mapmodule.request.StopGeometrySearchRequestHandler
 * Handles Oskari.harava.bundle.mapmodule.request.StopGeometrySearchRequest.
 */
Oskari.clazz.define('Oskari.harava.bundle.mapmodule.request.StopGeometrySearchRequestHandler', function(sandbox, searchPlugin) {

    this.sandbox = sandbox;
    this.searchPlugin = searchPlugin;
}, {
	/**
	 * @method handleRequest 
	 * Stop geometry search
	 * @param {Oskari.mapframework.core.Core} core
	 * 		reference to the application core (reference sandbox core.getSandbox())
	 * @param {Oskari.harava.bundle.havaraInfobox.request.ShowInfoBoxRequest} request
	 * 		request to handle
	 */
    handleRequest : function(core, request) {
        this.sandbox.printDebug("[Oskari.harava.bundle.mapmodule.request.StopGeometrySearchRequest] Stop drawing search");
        this.searchPlugin.removeAllDrawings();
    }
}, {
	/**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    protocol : ['Oskari.mapframework.core.RequestHandler']
});
