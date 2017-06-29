/**
 * @class Oskari.mapframework.bundle.admin.request.AddTabRequestHandler
 */
Oskari.clazz.define('Oskari.mapframework.bundle.admin.request.AddTabRequestHandler',
/**
 * @method create called automatically on construction
 * @static
 * @param {Oskari.Sandbox} sandbox
 *          reference to application sandbox
 * @param {Oskari.mapframework.bundle.search.StateHandlerBundleInstance} search
 *          reference to search
 */
function(sandbox, flyout) {
    this.sandbox = sandbox;
    this.flyout = flyout;
}, {
    /**
     * @method handleRequest
     * @param {Oskari.mapframework.core.Core} core
     *      reference to the application core (reference sandbox core.getSandbox())
     * @param {Oskari.mapframework.bundle.personaldata.request.AddTabRequestHandler} request
     *      request to handle
     */
    handleRequest : function(core, request) {
        this.flyout.addTab({"title": request.getTitle(), "content": request.getContent(), "priority": request.getPriority(), "id": request.getId()});
   }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    protocol : ['Oskari.mapframework.core.RequestHandler']
});
