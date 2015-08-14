/**
 * @class Oskari.mapframework.bundle.search.request.AddTabRequestHandler
 */
Oskari.clazz.define('Oskari.mapframework.bundle.search.request.AddTabRequestHandler',
/**
 * @method create called automatically on construction
 * @static
 * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
 *          reference to application sandbox
 * @param {Oskari.mapframework.bundle.search.StateHandlerBundleInstance} search
 *          reference to search
 */
function(sandbox, search) {
    this.sandbox = sandbox;
    this.search = search;
}, {
    /**
     * @method handleRequest 
     * @param {Oskari.mapframework.core.Core} core
     *      reference to the application core (reference sandbox core.getSandbox())
     * @param {Oskari.mapframework.bundle.personaldata.request.AddTabRequestHandler} request
     *      request to handle
     */
    handleRequest : function(core, request) {
        this.search.addTab({"title": request.getTitle(), "content": request.getContent(), "priority": request.getPriority()});
   }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    protocol : ['Oskari.mapframework.core.RequestHandler']
});
