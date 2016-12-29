/**
 * @class Oskari.mapframework.bundle.search.request.SearchResultActionRequestHandler
 */
Oskari.clazz.define('Oskari.mapframework.bundle.search.request.SearchResultActionRequestHandler',
/**
 * @method create called automatically on construction
 * @static
 * @param {Oskari.Sandbox} sandbox
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
     * @param {Oskari.mapframework.bundle.personaldata.request.SearchResultActionRequestHandler} request
     *      request to handle
     */
    handleRequest : function(core, request) {
        if (request.getName() === 'Search.AddSearchResultActionRequest') {
            this.search.addSearchResultAction({
                'name': request.getLinkName(),
                'callback': request.getCallback()
            });
        }
        else if (request.getName() === 'Search.RemoveSearchResultActionRequest') {
            this.search.removeSearchResultAction(request.getLinkName());
        }
   }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    protocol : ['Oskari.mapframework.core.RequestHandler']
});
