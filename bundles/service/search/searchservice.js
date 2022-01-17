import './event/SearchResultEvent';
import './request/SearchRequest';

/**
 * @class Oskari.service.search.SearchService
 *
 * Requests for a search to be made with the given query and provides
 * callbacks
 */
Oskari.clazz.define('Oskari.service.search.SearchService',

    /**
     * @method create called automatically on construction
     * @static
     *
     * @param {Oskari.Sandbox}
     *            sandbox sandbox to handle requests/events (optional)
     * @param {String}
     *            searchUrl ajax URL to actual search implementation (optional)
     */
    function (sandbox, searchUrl) {
        this._searchUrl = searchUrl;
        this.sandbox = sandbox;
        if (sandbox && typeof sandbox.getService === 'function') {
            var service = sandbox.getService(this.getQName());
            if (service) {
                // already registered
                return service;
            }
            // else setup this instance
            if (!searchUrl) {
                this._searchUrl = Oskari.urls.getRoute('GetSearchResult');
            }
            sandbox.requestHandler('SearchRequest', this);
            sandbox.registerService(this);
        }
    }, {
        /** @static @property __qname fully qualified name for service */
        __qname: 'Oskari.service.SearchService',
        /**
         * @method getQName
         * @return {String} fully qualified name for service
         */
        getQName: function () {
            return this.__qname;
        },
        /** @static @property __name service name */
        __name: 'SearchService',
        /**
         * @method getName
         * @return {String} service name
         */
        getName: function () {
            return this.__name;
        },
        /**
         * @method handleRequest
         * Gets search results from the service
         * @param {Oskari.mapframework.core.Core} core
         *      reference to the application core (reference sandbox core.getSandbox())
         * @param {Oskari.mapframework.bundle.search.request.SearchRequest} request
         *      request to handle
         */
        handleRequest: function (core, request) {
            const params = request.getSearchParams();
            this.doSearch(params, undefined, undefined, request.getOptions());
        },
        /**
         * @method doSearch
         *
         * Makes the actual ajax call to search service implementation
         * @param {String}
         *            searchString the query to search with
         * @param {Function}
         *            onSuccess callback method for successful search
         * @param {Function}
         *            onComplete callback method for search completion
         * @param {Object}
         *            options optional parameters for server side implementation that may be handled by the search channels or not depending on implementation
         */
        doSearch: function (searchString, onSuccess, onError, options = {}) {
            const sb = this.sandbox || Oskari.getSandbox();
            const evtBuilder = Oskari.eventBuilder('SearchResultEvent');
            jQuery.ajax({
                dataType: 'json',
                type: 'POST',
                url: this._searchUrl,
                data: {
                    'q': searchString,
                    'lang': Oskari.getLang(),
                    'epsg': sb.getMap().getSrsName(),
                    'options': JSON.stringify(options)
                },
                success: function (response) {
                    sb.notifyAll(evtBuilder(true, searchString, response, options));
                    if (typeof onSuccess === 'function') {
                        onSuccess(response);
                    }
                },
                error: function (response) {
                    sb.notifyAll(evtBuilder(false, searchString, response, options));
                    if (typeof onError === 'function') {
                        onError(response);
                    }
                }
            });
        },
        doAutocompleteSearch: function (searchKey, onSuccess) {
            if (typeof onSuccess !== 'function') {
                return;
            }
            var sb = this.sandbox || Oskari.getSandbox();
            jQuery.ajax({
                dataType: 'json',
                type: 'POST',
                url: this._searchUrl,
                data: {
                    'q': searchKey,
                    'lang': Oskari.getLang(),
                    'epsg': sb.getMap().getSrsName(),
                    'autocomplete': true
                },
                success: function (response) {
                    onSuccess(response);
                }
            });
        },
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol': ['Oskari.mapframework.service.Service', 'Oskari.mapframework.core.RequestHandler']
    });
