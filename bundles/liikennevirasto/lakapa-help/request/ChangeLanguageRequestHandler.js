/**
 * @class Oskari.liikennevirasto.bundle.lakapa.help.request.ChangeLanguageRequestHandler
 * Handles Oskari.liikennevirasto.bundle.lakapa.help.request.ChangeLanguageRequest.
 */
Oskari.clazz.define('Oskari.liikennevirasto.bundle.lakapa.help.request.ChangeLanguageRequestHandler', function(sandbox, instance) {
    this.sandbox = sandbox;
    this.instance = instance;
}, {
    /**
     * @method handleRequest
     * Add to basket
     * @param {Oskari.mapframework.core.Core} core
     *         reference to the application core (reference sandbox core.getSandbox())
     * @param {Oskari.liikennevirasto.bundle.lakapa.help.request.ChangeLanguageRequest} request
     *         request to handle
     */
    handleRequest : function(core, request) {
        var me = this;
        me.sandbox.printDebug('[Oskari.liikennevirasto.bundle.lakapa.help.request.ChangeLanguageRequest] language changed');
        jQuery.cookie('language', request._language, {expires: 365});
        location.reload(true);
        //me.instance.plugins['Oskari.userinterface.Flyout'].createUI(request.getTransport());
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    protocol : ['Oskari.mapframework.core.RequestHandler']
});
