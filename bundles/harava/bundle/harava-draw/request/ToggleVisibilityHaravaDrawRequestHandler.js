/**
 * @class Oskari.harava.bundle.mapmodule.request.ToggleVisibilityHaravaDrawRequestHandler
 * Handles Oskari.harava.bundle.mapmodule.request.ToggleVisibilityHaravaRequest.
 */
Oskari.clazz.define('Oskari.harava.bundle.mapmodule.request.ToggleVisibilityHaravaDrawRequestHandler', function(sandbox, plugin) {

    this.sandbox = sandbox;
    this.plugin = plugin;
}, {
	/**
	 * @method handleRequest 
	 * Start geometry search
	 * @param {Oskari.mapframework.core.Core} core
	 * 		reference to the application core (reference sandbox core.getSandbox())
	 * @param {Oskari.harava.bundle.mapmodule.request.ToggleVisibilityHaravaDrawRequest} request
	 * 		request to handle
	 */
    handleRequest : function(core, request) {
        var visibility = request.getVisibility();
        var deleteAll = request.getDeleteAll();
        this.sandbox.printDebug("[Oskari.harava.bundle.mapmodule.request.ToggleVisibilityHaravaDrawRequest] Toggle visibility: " + visibility);
        this.plugin.toggleVisibility(visibility, deleteAll);
    }
}, {
	/**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    protocol : ['Oskari.mapframework.core.RequestHandler']
});
