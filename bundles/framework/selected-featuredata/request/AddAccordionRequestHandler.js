/**
 * @class Oskari.mapframework.bundle.selected-featuredata.request.AddAccordionRequestHandler
 */
Oskari.clazz.define('Oskari.mapframework.bundle.selected-featuredata.request.AddAccordionRequestHandler',
/**
 * @method create called automatically on construction
 * @static
 * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
 *          reference to application sandbox
 * @param {Oskari.mapframework.bundle.selected-featuredata.StateHandlerBundleInstance} selected-featuredata
 *          reference to selected-featuredata
 */
function(sandbox, selected_featuredata) {
    this.sandbox = sandbox;
    this.selected_featuredata = selected_featuredata;
}, {
    /**
     * @method handleRequest
     * @param {Oskari.mapframework.core.Core} core
     *      reference to the application core (reference sandbox core.getSandbox())
     * @param {Oskari.mapframework.bundle.selected-featuredata.request.AddTabRequestHandler} request
     *      request to handle
     */
    handleRequest : function(core, request) {
        this.selected_featuredata.addAccordion({"title": request.getTitle(), "content": request.getContent(), "visible": request.getVisible(), "id": request.getId(), "tabid": request.getTabId()});
   }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    protocol : ['Oskari.mapframework.core.RequestHandler']
});
