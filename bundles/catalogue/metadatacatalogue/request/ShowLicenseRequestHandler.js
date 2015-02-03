/**
 * @class Oskari.catalogue.bundle.metadatacatalogue.request.ShowLicenseRequestHandler
 * Handles Oskari.catalogue.bundle.metadatacatalogue.request.ShowLicenseRequest.
 */
 /**
 * @method create called automatically on construction
 * @static
 * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
 *          reference to application sandbox
 * @param {Oskari.catalogue.bundle.metadatacatalogue.MetadataCatalogueBundleInstance} instance
 *          reference to my metadatacatalogue bundle instance
 */
Oskari.clazz.define('Oskari.catalogue.bundle.metadatacatalogue.request.ShowLicenseRequestHandler', function(sandbox, instance) {
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
        var licenseElement = request.getLicenseElement(),
            callback = request.getCallback(),
            bindCallbackTo = request.getBindCallbackTo(),
            licenseTextElement = request.getLicenseTextElement();
        this.sandbox.printDebug("[Oskari.catalogue.bundle.metadatacatalogue.request.ShowLicenseRequest]");
        this.instance.setLicenseStatus(licenseElement, licenseTextElement, callback, bindCallbackTo);
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    protocol : ['Oskari.mapframework.core.RequestHandler']
});