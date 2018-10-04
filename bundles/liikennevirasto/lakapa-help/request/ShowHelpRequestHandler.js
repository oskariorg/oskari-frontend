/**
 * @class Oskari.liikennevirasto.bundle.lakapa.help.request.ShowHelpRequestHandler
 * Handles Oskari.liikennevirasto.bundle.lakapa.help.request.ShowHelpRequest.
 */
Oskari.clazz.define('Oskari.liikennevirasto.bundle.lakapa.help.request.ShowHelpRequestHandler', function(sandbox, instance) {
    this.sandbox = sandbox;
    this.instance = instance;
}, {
	/**
	 * @method handleRequest
	 * Add to basket
	 * @param {Oskari.mapframework.core.Core} core
	 * 		reference to the application core (reference sandbox core.getSandbox())
	 * @param {Oskari.liikennevirasto.bundle.lakapa.help.selector.ShowHelpRequest} request
	 * 		request to handle
	 */
    handleRequest : function(core, request) {
    	var me = this;
        me.sandbox.printDebug('[Oskari.liikennevirasto.bundle.lakapa.help.request.ShowHelpRequest] show help called');
        me.sandbox.printDebug(request);
        me.instance.showHelp();
        //me.instance.plugins['Oskari.userinterface.Flyout'].createUI(request.getTransport());

    }
}, {
	/**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    protocol : ['Oskari.mapframework.core.RequestHandler']
});
