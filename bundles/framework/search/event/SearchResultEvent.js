/**
 * @class Oskari.mapframework.bundle.search.event.SearchResultEvent
 *
 * Response of search result
 */
Oskari.clazz.define('Oskari.mapframework.bundle.search.event.SearchResultEvent',
/**
 * @method create called automatically on construction
 * @static
 * @param {Boolean} success succesfully got route
 * @param {JSON} requestParameters request parameters
 * @param {JSON} search result
 */
function(success, requestParameters, result) {
    this._success = success;
    this._requestParameters = requestParameters;
    this._result = result;
}, {
    /** @static @property __name event name */
    __name : "SearchResultEvent",

    /**
     * @method getName
     * Returns event name
     * @return {String}
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getSuccess
     * Returns the successfully routing info
     * @return {Boolean}
     */
    getSuccess : function() {
        return this._success;
    },
    /**
     * @method getResult
     * Returns the search result JSON
     * @return {JSON}
     */
    getResult : function() {
        return this._result;
    },
    /**
     * @method getRequestParameters
     * Returns request paremeters
     * @return {JSON}
     */
    getRequestParameters : function() {
        return this._requestParameters;
    },

    getParams: function () {
        return {
            success: this._success,
            result: this._result,
            requestParameters: this._requestParameters
        };
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.event.Event']
});