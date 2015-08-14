/**
 * @class Oskari.harava.bundle.mapmodule.request.StartGeometrySearchRequestHandler
 * Handles Oskari.harava.bundle.mapmodule.request.StartGeometrySearchRequest.
 */
Oskari.clazz.define('Oskari.harava.bundle.mapmodule.request.StartGeometrySearchRequestHandler', function(sandbox, searchPlugin) {

    this.sandbox = sandbox;
    this.searchPlugin = searchPlugin;
}, {
	/**
	 * @method handleRequest 
	 * Start geometry search
	 * @param {Oskari.mapframework.core.Core} core
	 * 		reference to the application core (reference sandbox core.getSandbox())
	 * @param {Oskari.harava.bundle.havaraInfobox.request.ShowInfoBoxRequest} request
	 * 		request to handle
	 */
    handleRequest : function(core, request) {
        var searchMode = request.getSearchMode();
        this.sandbox.printDebug("[Oskari.harava.bundle.mapmodule.request.StartGeometrySearchRequest] Start Searching: " + searchMode);
        this.searchPlugin.startSearch(request.getSearchMode());
    }
}, {
	/**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    protocol : ['Oskari.mapframework.core.RequestHandler']
});
