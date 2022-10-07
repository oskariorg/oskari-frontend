/**
 * @class Oskari.mapframework.bundle.mapmodule.request.GetFeatureInfoRequest
 *
 * Requests for a get feature info for the given spot on the map to be shown.
 *
 * Requests are build and sent through Oskari.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define(
    'Oskari.mapframework.bundle.mapmodule.request.GetFeatureInfoRequest',

    /**
     * @static @method create called automatically on construction
     *
     * @param {Number} lon
     * longitude
     * @param {Number} lat
     * latitude
     *
     */
    function (lon, lat) {
        this._lon = lon;
        this._lat = lat;
    }, {
        /** @static @property __name request name */
        __name: 'MapModulePlugin.GetFeatureInfoRequest',

        /**
         * @public @method getName
         * @return {String} request name
         */
        getName: function () {
            return this.__name;
        },

        /**
         * @public @method getLon
         *
         * @return {Number} longitude
         */
        getLon: function () {
            return this._lon;
        },

        /**
         * @public @method getLat
         *
         * @return {Number} latitude
         */
        getLat: function () {
            return this._lat;
        }
    }, {
        /**
         * @static @property {String[]} protocol
         * array of superclasses as {String}
         */
        protocol: ['Oskari.mapframework.request.Request']
    }
);
