/**
 * @class Oskari.liikennevirasto.bundle.lakapa.AddToBasketRequestHandler
 * Handles Oskari.liikennevirasto.bundle.lakapa.AddToBasketRequest.
 */
Oskari.clazz.define('Oskari.liikennevirasto.bundle.lakapa.AddToBasketRequestHandler', function(sandbox, flyout, tile) {
    this.sandbox = sandbox;
    this.flyout = flyout;
    this.tile = tile;
}, {
	/**
	 * @method handleRequest
	 * Add to basket
	 * @param {Oskari.mapframework.core.Core} core
	 * 		reference to the application core (reference sandbox core.getSandbox())
	 * @param {Oskari.liikennevirasto.bundle.lakapa.AddToBasketRequest} request
	 * 		request to handle
	 */
    handleRequest : function(core, request) {
        this.sandbox.printDebug("[Oskari.liikennevirasto.bundle.lakapa.AddToBasketRequest] Add to basket");
        this.flyout.addToBasket(request.getBbox(), request.getSelectedLayers(),request.getCroppingMode(),
        		request.getTransport(), request.getIdentifier(), request.getFeatures());
        this.tile.refresh();
        this.tile.notifyUser();
    }
}, {
	/**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    protocol : ['Oskari.mapframework.core.RequestHandler']
});
