/**
 * @class Oskari.liikennevirasto.bundle.transport.selector.ShowMessageRequestHandler
 * Handles Oskari.liikennevirasto.bundle.transport.selector.ShowMessageRequest.
 */
Oskari.clazz.define('Oskari.liikennevirasto.bundle.transport.selector.ShowMessageRequestHandler', function(sandbox, plugin) {
    this.sandbox = sandbox;
    this.plugin = plugin;
}, {
    /**
     * @method handleRequest
     * Add to basket
     * @param {Oskari.mapframework.core.Core} core
     *         reference to the application core (reference sandbox core.getSandbox())
     * @param {Oskari.liikennevirasto.bundle.transport.selector.ShowMessageRequest} request
     *         request to handle
     */
    handleRequest : function(core, request) {
        var me = this;
        me.sandbox.printDebug('[Oskari.liikennevirasto.bundle.transport.selector.ShowMessageRequest] show message');
        me.plugin.showMessage(request.getTitle(),request.getMessage(), request.getHandler());
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    protocol : ['Oskari.mapframework.core.RequestHandler']
});
