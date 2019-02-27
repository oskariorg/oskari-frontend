/**
 * @class Oskari.mapframework.bundle.mapmodule.request.StartUserLocationTrackingRequest
 *
 * Requests for a track user location.
 *
 * Requests are build and sent through Oskari.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define(
    'Oskari.mapframework.bundle.mapmodule.request.StartUserLocationTrackingRequest',

    /**
     * @static @method create called automatically on construction
     *
     */
    function (options) {
        this._options = options || {};
    }, {
        /** @static @property __name request name */
        __name: 'StartUserLocationTrackingRequest',

        /**
         * @public @method getName
         * @return {String} request name
         */
        getName: function () {
            return this.__name;
        },

        /**
         * @method  @public getOptions
         * @return {Object} options
         */
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
