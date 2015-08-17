/**
 * @class Oskari.liikennevirasto.bundle.lakapa.ClearBasketRequestHandler
 * Handles Oskari.liikennevirasto.bundle.lakapa.ClearBasketRequest.
 */
Oskari.clazz.define('Oskari.liikennevirasto.bundle.lakapa.ClearBasketRequestHandler', function(sandbox, flyout, tile) {
    this.sandbox = sandbox;
    this.flyout = flyout;
    this.tile = tile;
}, {
	/**
	 * @method handleRequest 
	 * Add to basket
	 * @param {Oskari.mapframework.core.Core} core
	 * 		reference to the application core (reference sandbox core.getSandbox())
	 * @param {Oskari.liikennevirasto.bundle.lakapa.ClearBasketRequest} request
	 * 		request to handle
	 */
    handleRequest : function(core, request) {
        this.sandbox.printDebug("[Oskari.liikennevirasto.bundle.lakapa.ClearBasketRequest] Clear basket");
        this.flyout.clear();
        this.tile.clear();
    }
}, {
	/**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    protocol : ['Oskari.mapframework.core.RequestHandler']
});
