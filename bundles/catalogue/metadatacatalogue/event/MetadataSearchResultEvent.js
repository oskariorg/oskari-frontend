/**
 * @class Oskari.mapframework.bundle.metadatacatalogue.event.MetadataSearchResultEvent
 *
 * Used to notify components metadata search response.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.metadatacatalogue.event.MetadataSearchResultEvent',
/**
  * @method create called automatically on construction
  * @static
  * @param {Object} result the search results
  * @param {Boolean} error the error, if search cannot do then return error = true --> event listener bundles needs handle this
  */
    function (result, error) {
        this._result = result;
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
        * @method getResult
        * Returns the search result object
        * @return {Object}
        */
        getResult: function () {
            return this._result;
        },
        /**
         * @method hasError
         * Returns true if error come
         * @returns {Boolean}
         */
        hasError: function () {
            return this._error;
        }
    }, {
        /**
        * @property {String[]} protocol array of superclasses as {String}
        * @static
        */
        protocol: ['Oskari.mapframework.event.Event']
    }
);
