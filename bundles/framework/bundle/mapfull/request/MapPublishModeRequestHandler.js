/**
 * @class Oskari.mapframework.bundle.mapmodule.request.MapLayerVisibilityRequestHandler
 * Shows/hides the maplayer specified in the request in OpenLayers implementation.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapfull.request.MapPublishModeRequestHandler', 
/**
 * @method create called automatically on construction
 * @static
 * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
 * 			reference to application sandbox
 */
function(mapfull) {
    this.mapfull = mapfull;
}, {
	/**
	 * @method handleRequest 
	 * Shows/hides the maplayer specified in the request in OpenLayers implementation.
	 * @param {Oskari.mapframework.core.Core} core
	 * 		reference to the application core (reference sandbox core.getSandbox())
	 * @param {Oskari.mapframework.bundle.mapmodule.request.MapLayerVisibilityRequest} request
	 * 		request to handle
	 */
    handleRequest : function(core, request) {
        this.mapfull.isPublished = request.getPublishMode();

   }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    protocol : ['Oskari.mapframework.core.RequestHandler']
});
