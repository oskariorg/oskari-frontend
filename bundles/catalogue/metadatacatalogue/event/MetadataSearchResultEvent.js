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
  * @param {Boolean} success the success, if search cannot do then return success = false --> event listener bundles needs handle this
  */
    function (results, success) {
        this._results = results;
        this._success = success;
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
         * @method hasSuccess
         * Returns true if search succees
         * @returns {Boolean}
         */
        hasSuccess: function () {
            return this._success;
        },
        /**
         * Serialization for RPC
         * @return {Object} object has key id which has the marker id of the clicked
         */
        getParams: function () {
            return {
                results: this.getResults(),
                success: this.hasSuccess()
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
