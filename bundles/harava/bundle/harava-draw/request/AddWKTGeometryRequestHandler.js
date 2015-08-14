/**
 * @class Oskari.harava.bundle.mapmodule.request.AddWKTGeometryRequestHandler
 * Handles Oskari.harava.bundle.mapmodule.request.AddWKTGeometryRequest.
 */
Oskari.clazz.define('Oskari.harava.bundle.mapmodule.request.AddWKTGeometryRequestHandler', function(sandbox, plugin) {

    this.sandbox = sandbox;
    this.plugin = plugin;
}, {
	/**
	 * @method handleRequest 
	 * Start geometry search
	 * @param {Oskari.mapframework.core.Core} core
	 * 		reference to the application core (reference sandbox core.getSandbox())
	 * @param {Oskari.harava.bundle.mapmodule.request.AddWKTGeometryRequest} request
	 * 		request to handle
	 */
    handleRequest : function(core, request) {
        var wkt = request.getWKTString();
        
        this.sandbox.printDebug("[Oskari.harava.bundle.mapmodule.request.AddWKTGeometryRequest]");
        this.plugin.addWKT(wkt);
    }
}, {
	/**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    protocol : ['Oskari.mapframework.core.RequestHandler']
});
