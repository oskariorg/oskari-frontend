/**
 * @class Oskari.harava.bundle.mapmodule.request.UpdateMapRequestHandler
 * Handles Oskari.harava.bundle.mapmodule.request.UpdateMapRequest to update map.
 */
Oskari.clazz.define('Oskari.harava.bundle.mapmodule.request.UpdateMapRequestHandler', 
/**
 * @method create called automatically on construction
 * @static
 *
 * @param {Oskari.mapframework.sandbox.Sandbox}
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
	 * Update map
	 * @param {Oskari.mapframework.core.Core} core
	 * 		reference to the application core (reference sandbox core.getSandbox())
	 * @param {Oskari.harava.bundle.havaraInfobox.request.ShowInfoBoxRequest} request
	 * 		request to handle
	 */
    handleRequest : function(core, request) {
    	var openlayersMap = this.mapModule.getMap();
    	openlayersMap.updateSize();
   }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    protocol : ['Oskari.mapframework.core.RequestHandler']
});