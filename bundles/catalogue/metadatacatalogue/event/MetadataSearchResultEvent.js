/**
 * @class Oskari.mapframework.bundle.metadatacatalogue.event.MetadataSearchResultEvent
 *
 * Used to notify components metadata search response.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.metadatacatalogue.event.MetadataSearchResultEvent',
/**
  * @method create called automatically on construction
  * @static
  * @param {Array} results the search results
  * @param {Boolean} error the error, if search cannot do then return error = true --> event listener bundles needs handle this
  */
    function (results, error) {
        this._results = results;
        this._error = error;
    }, {
        /** @static @property __name event name */
        __name: 'MetadataSearchResultEvent',
        /**
         * @method getName
         * Returns event name
         * @return {String}
         */
        getName: function () {
            return this.__name;
        },
        /**
        * @method getResults
        * Returns the search result object
        * @return {Array}
        */
        getResults: function () {
            return this._results;
        },
        /**
         * @method hasError
         * Returns true if error come
         * @returns {Boolean}
         */
        hasError: function () {
            return this._error;
        },
        /**
         * Serialization for RPC
         * @return {Object} object has key id which has the marker id of the clicked
         */
        getParams: function () {
            return {
                results: this.getResults(),
                error: this.hasError()
            };
        }
    }, {
        /**
        * @property {String[]} protocol array of superclasses as {String}
        * @static
        */
        protocol: ['Oskari.mapframework.event.Event']
    }
);
