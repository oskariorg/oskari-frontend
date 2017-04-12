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
     * @params {Object}
     */
    function(params) {
        this._searchparams = params;
    }, {
        /** @static @property __name request name */
        __name : "SearchRequest",
        /**
         * @method getName
         * @return {String} request name
         */
        getName : function() {
            return this.__name;
        },
        /**
         * @method getSearchParams
         * @return {Object} parameters given for search
         */
        getSearchParams : function() {
            return this._searchparams;
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol' : ['Oskari.mapframework.request.Request']
    });
