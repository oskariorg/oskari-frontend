/**
 * @class Oskari.mapframework.core.Core
 *
 * Search requests handling
 */
Oskari.clazz.category('Oskari.mapframework.core.Core', 'search-methods', {
/**
 * @method handleSearchRequest
 * return value is gotten requests callback methods
 * @param {Oskari.mapframework.request.common.SearchRequest}
 *            searchRequest search request
 */
    handleSearchRequest : function(searchRequest) {
        this.printDebug("Doing search '" + searchRequest.getSearchString() + "'...");
        this.actionInProgressSearch();
        var searchService = this.getService('Oskari.mapframework.service.SearchService');
        searchService.doSearch(searchRequest.getSearchString(), searchRequest.getOnSuccess(), searchRequest.getOnComplete());
    }
});
