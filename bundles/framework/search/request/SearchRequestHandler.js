/**
 * @class Oskari.mapframework.bundle.search.request.SearchRequestHandler
 * Handles Oskari.mapframework.bundle.search.request.SearchRequest.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.search.request.SearchRequestHandler',
    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.mapframework.bundle.search.SearchServiceBundleInstance} searchService
     *          reference to routingService
     */
    function(searchService) {
        this.searchService = searchService;
    }, {
        /**
         * @method handleRequest
         * Gets search results from the service
         * @param {Oskari.mapframework.core.Core} core
         *      reference to the application core (reference sandbox core.getSandbox())
         * @param {Oskari.mapframework.bundle.search.request.SearchRequest} request
         *      request to handle
         */
        handleRequest : function(core, request) {
            var params = request.getSearchParams();
            this.searchService.getSearchResult(params);
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        protocol : ['Oskari.mapframework.core.RequestHandler']
    });
