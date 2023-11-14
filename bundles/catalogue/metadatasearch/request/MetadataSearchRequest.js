/**
 * @class Oskari.catalogue.bundle.metadatasearch.request.MetadataSearchRequest
 * Requests to search metadata catalogue.
 *
 * Requests are build and sent through Oskari.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.catalogue.bundle.metadatasearch.request.MetadataSearchRequest',
    /**
    * @method create called automatically on construction
    * @static
    *
    * @param {Object} search request data
    */
    function (search) {
        this._search = search;
    },
    {
        /** @static @property __name request name */
        __name: 'MetadataSearchRequest',
        /**
        * @method getName
        * @return {String} request name
        */
        getName: function () {
            return this.__name;
        },
        /**
         * @method getSearch
         * @return {Object} search object
         */
        getSearch: function () {
            return this._search;
        }
    },
    {
        /**
        * @property {String[]} protocol array of superclasses as {String}
        * @static
        */
        protocol: ['Oskari.mapframework.request.Request']
    }
);
