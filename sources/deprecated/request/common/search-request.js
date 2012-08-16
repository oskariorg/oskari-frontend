/**
 * @class Oskari.mapframework.request.common.SearchRequest
 *
 * Requests for a search to be made with the given query and provides
 * callbacks
 * 
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.mapframework.request.common.SearchRequest', 

/**
 * @method create called automatically on construction
 * @static
 *
 * @param {String}
 *            searchString the query to search with
 * @param {Function}
 *            onSuccess callback method for successful search 
 * @param {Function}
 *            onComplete callback method for search completion
 */
function(searchString, onSuccess, onComplete) {
    this._creator = null;
    this._searchString = searchString;

    this._onSuccess = onSuccess;

    this._onComplete = onComplete;
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
     * @method getSearchString
     * @return {String} query to search with
     */
    getSearchString : function() {
        return this._searchString;
    },
    /**
     * @method getOnSuccess
     * @return {Function} callback method for successful search 
     */
    getOnSuccess : function() {
        return this._onSuccess;
    },
    /**
     * @method getOnComplete
     * @return {Function} callback method for search completion
     */
    getOnComplete : function() {
        return this._onComplete;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.request.Request']
});

/* Inheritance */