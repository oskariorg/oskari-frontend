/**
 * @class Oskari.liikennevirasto.bundle.lakapa.RefreshBasketRequestHandler
 * Handles Oskari.liikennevirasto.bundle.lakapa.RefreshBasketRequest.
 */
Oskari.clazz.define('Oskari.liikennevirasto.bundle.lakapa.RefreshBasketRequestHandler', function(sandbox, flyout, tile) {
    this.sandbox = sandbox;
    this.flyout = flyout;
    this.tile = tile;
}, {
	/**
	 * @method handleRequest
	 * Add to basket
	 * @param {Oskari.mapframework.core.Core} core
	 * 		reference to the application core (reference sandbox core.getSandbox())
	 * @param {Oskari.liikennevirasto.bundle.lakapa.RefreshBasketRequest} request
	 * 		request to handle
	 */
    handleRequest : function(core, request) {
        this.sandbox.printDebug('[Oskari.liikennevirasto.bundle.lakapa.RefreshBasketRequest] Refresh basket');
        this.flyout.refresh();
        this.tile.refresh();
    }
}, {
	/**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    protocol : ['Oskari.mapframework.core.RequestHandler']
});
