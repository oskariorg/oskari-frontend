/**
 * @class Oskari.harava.bundle.mapmodule.request.ZoomToExtentRequestHandler
 * Handles Oskari.harava.bundle.mapmodule.request.ZoomToExtentRequest to zoom to extent.
 */
Oskari.clazz.define('Oskari.harava.bundle.mapmodule.request.ZoomToExtentRequestHandler',
/**
 * @method create called automatically on construction
 * @static
 *
 * @param {Oskari.Sandbox}
 *            sandbox reference to sandbox
 * @param {Oskari.mapframework.ui.module.common.MapModule}
 *            mapModule reference to mapmodule
 */
function(sandbox, mapModule) {
    this.sandbox = sandbox;
    this.mapModule = mapModule;
}, {
	/**
	 * @method handleRequest
	 * Zoom to Extent
	 * @param {Oskari.mapframework.core.Core} core
	 * 		reference to the application core (reference sandbox core.getSandbox())
	 * @param {Oskari.harava.bundle.havaraInfobox.request.ShowInfoBoxRequest} request
	 * 		request to handle
	 */
    handleRequest : function(core, request) {
    	this.mapModule.zoomToExtent(request.getBounds(), false,false);
   }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    protocol : ['Oskari.mapframework.core.RequestHandler']
});