/**
 * @class Oskari.mapframework.bundle.search.request.SearchRequest
 * Requests search results (addresses, locations) by given params
 *
 * Requests are build and sent through Oskari.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.search.request.SearchRequest',
    /**
     * @method create called automatically on construction
     * @static
     *
     * @param {String} query search qyery
     * @param {Object} options optional flags for server
     */
    function (query, options) {
        this._query = query;
        this._options = options;
    }, {
        /** @static @property __name request name */
        __name: 'SearchRequest',
        /**
         * @method getName
         * @return {String} request name
         */
        getName: function () {
            return this.__name;
        },
        /**
         * @method getSearchParams
         * @return {String} query given for search
         */
        getSearchParams: function () {
            return this._query;
        },
        /**
         * @method getSearchParams
         * @return {Object} parameters given for search
         */
        getOptions: function () {
            return this._options || {};
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol': ['Oskari.mapframework.request.Request']
    });
