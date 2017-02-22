/**
 * @class Oskari.mapframework.bundle.personaldata.request.AddTabRequestHandler
 */
Oskari.clazz.define('Oskari.mapframework.bundle.personaldata.request.AddTabRequestHandler',
/**
 * @method create called automatically on construction
 * @static
 * @param {Oskari.Sandbox} sandbox
 *          reference to application sandbox
 * @param {Oskari.mapframework.bundle.personaldata.StateHandlerBundleInstance} personaldata
 *          reference to personaldata
 */
function(sandbox, personaldata) {
    this.sandbox = sandbox;
    this.personaldata = personaldata;
}, {
    /**
     * @method handleRequest
     * @param {Oskari.mapframework.core.Core} core
     *      reference to the application core (reference sandbox core.getSandbox())
     * @param {Oskari.mapframework.bundle.personaldata.request.AddTabRequestHandler} request
     *      request to handle
     */
    handleRequest : function(core, request) {
        this.personaldata.addTab({"title": request.getTitle(), "content": request.getContent(), "first": request.isFirst(), "id": request.getId()});
   }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    protocol : ['Oskari.mapframework.core.RequestHandler']
});
