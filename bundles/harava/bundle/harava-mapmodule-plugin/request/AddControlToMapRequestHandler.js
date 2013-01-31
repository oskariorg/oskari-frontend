/**
 * @class Oskari.harava.bundle.mapmodule.request.AddControlToMapRequestHandler
 * Handles Oskari.harava.bundle.mapmodule.request.AddControlToMapRequest to add OpenLayers control to map.
 */
Oskari.clazz.define('Oskari.harava.bundle.mapmodule.request.AddControlToMapRequestHandler', 
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
	 * Add control to map
	 * @param {Oskari.mapframework.core.Core} core
	 * 		reference to the application core (reference sandbox core.getSandbox())
	 * @param {Oskari.harava.bundle.havaraInfobox.request.ShowInfoBoxRequest} request
	 * 		request to handle
	 */
    handleRequest : function(core, request) {
    	var openlayersMap = this.mapModule.getMap();
    	var control = request.getControl();
    	if(control!=null){
    		openlayersMap.addControl(control);
    	}
   }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    protocol : ['Oskari.mapframework.core.RequestHandler']
});