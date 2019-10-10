/**
 * @class Oskari.mapframework.bundle.mapmodule.request.GetUserLocationRequest
 *
 * Requests for a get user location.
 *
 * Requests are build and sent through Oskari.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define(
    'Oskari.mapframework.bundle.mapmodule.request.GetUserLocationRequest',

    /**
     * @static @method create called automatically on construction
     *
     */
    function (centerMap, options) {
        this._centerMap = centerMap;
        this._options = options || {};
    }, {
        /** @static @property __name request name */
        __name: 'MyLocationPlugin.GetUserLocationRequest',

        /**
         * @public @method getName
         * @return {String} request name
         */
        getName: function () {
            return this.__name;
        },

        /**
         * @method  @public getCenterMap center map to user location
         * @return {Boolean} center map
         */
        getCenterMap: function () {
            return this._centerMap;
        },
        getOptions: function () {
            return this._options;
        }
    }, {
        /**
         * @static @property {String[]} protocol
         * array of superclasses as {String}
         */
        protocol: ['Oskari.mapframework.request.Request']
    }
);
