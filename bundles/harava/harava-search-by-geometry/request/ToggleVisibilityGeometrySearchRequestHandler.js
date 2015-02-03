/**
 * @class Oskari.harava.bundle.mapmodule.request.ToggleVisibilityGeometrySearchRequestHandler
 * Handles Oskari.harava.bundle.mapmodule.request.ToggleVisibilityGeometrySearchRequest.
 */
Oskari.clazz.define('Oskari.harava.bundle.mapmodule.request.ToggleVisibilityGeometrySearchRequestHandler', function(sandbox, searchPlugin) {

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
        var visibility = request.getVisibility();
        this.sandbox.printDebug("[Oskari.harava.bundle.mapmodule.request.ToggleVisibilityGeometrySearchRequest] Toggle visibility: " + visibility);
        this.searchPlugin.toggleVisibility(visibility);
    }
}, {
	/**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    protocol : ['Oskari.mapframework.core.RequestHandler']
});
