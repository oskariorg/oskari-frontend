/**
 * @class Oskari.catalogue.bundle.metadatacatalogue.request.AddSearchResultActionRequestHandler
 * Handles Oskari.catalogue.bundle.metadatacatalogue.request.AddSearchResultActionRequest.
 */
 /**
 * @method create called automatically on construction
 * @static
 * @param {Oskari.Sandbox} sandbox
 *          reference to application sandbox
 * @param {Oskari.catalogue.bundle.metadatacatalogue.MetadataCatalogueBundleInstance} instance
 *          reference to my metadatacatalogue bundle instance
 */
Oskari.clazz.define('Oskari.catalogue.bundle.metadatacatalogue.request.AddSearchResultActionRequestHandler', function(sandbox, instance) {
    this.sandbox = sandbox;
    this.instance = instance;
}, {
    /**
     * @method handleRequest
     * Add metadatacatalogue results to show licence element.
     * @param {Oskari.mapframework.core.Core} core
     *      reference to the application core (reference sandbox core.getSandbox())
     * @param {Oskari.catalogue.bundle.metadatacatalogue.request.ShowLicenseRequest} request
     *      request to handle
     */
    handleRequest : function(core, request) {
        var actionElement = request.getActionElement(),
            callback = request.getCallback(),
            bindCallbackTo = request.getBindCallbackTo(),
            actionTextElement = request.getActionTextElement(),
            actionText = request.getActionText(),
            showAction = request.getShowAction();
        this.sandbox.printDebug("[Oskari.catalogue.bundle.metadatacatalogue.request.AddSearchResultActionRequest]");
        this.instance.addSearchResultAction(actionElement, actionTextElement, callback, bindCallbackTo, actionText, showAction);
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    protocol : ['Oskari.mapframework.core.RequestHandler']
});