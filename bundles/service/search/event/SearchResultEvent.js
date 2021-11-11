/**
 * @class Oskari.mapframework.bundle.search.event.SearchResultEvent
 *
 * Response of search result
 */
Oskari.clazz.define(
    'Oskari.mapframework.bundle.search.event.SearchResultEvent',
    /**
     * @method create called automatically on construction
     * @static
     * @param {Boolean} success succesfully got a result or an error occured
     * @param {String} requestParameters request parameters
     * @param {Object} search result
     * @param {Object} options options that were used for searching
     */
    function (success, requestParameters, result, options = {}) {
        this._success = !!success;
        this._requestParameters = requestParameters;
        this._result = result;
        this._options = options;
    }, {
        __name: 'SearchResultEvent',

        /**
         * @method getName
         * Returns event name
         * @return {String}
         */
        getName: function () {
            return this.__name;
        },
        /**
         * @method getSuccess
         * Returns the successfully routing info
         * @return {Boolean}
         */
        getSuccess: function () {
            return this._success;
        },
        /**
         * @method getResult
         * Returns the search result JSON
         * @return {Object}
         */
        getResult: function () {
            return this._result;
        },
        /**
         * @method getOptions
         * Returns options that were used for searching
         * @return {Object}
         */
        getOptions: function () {
            return this._options || {};
        },
        /**
         * @method getRequestParameters
         * Returns request paremeters
         * @return {String}
         */
        getRequestParameters: function () {
            return this._requestParameters;
        },

        getParams: function () {
            return {
                success: this.getSuccess(),
                result: this.getResult(),
                requestParameters: this.getRequestParameters(),
                options: this.getOptions()
            };
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol': ['Oskari.mapframework.event.Event']
    });
