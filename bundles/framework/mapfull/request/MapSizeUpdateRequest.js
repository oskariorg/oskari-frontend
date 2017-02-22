/**
 * @class Oskari.mapframework.bundle.mapfull.request.MapSizeUpdateRequest
 * Request map size update
 *
 * Requests are build and sent through Oskari.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define(
    'Oskari.mapframework.bundle.mapfull.request.MapSizeUpdateRequest',
    /**
     * @static @method create called automatically on construction
     *
     *
     */
    function (fullUpdate) {
        this._creator = null;
        this.fullUpdate = fullUpdate;
    }, {
        /**
         * @static @property __name
         * Request name
         */
        __name: 'MapFull.MapSizeUpdateRequest',
        /**
         * @public @method getName
         *
         *
         * @return {string} request name
         */
        getName: function () {
            return this.__name;
        }
    }, {
        /**
         * @static @property {string[]} protocol
         * Array of superclasses as {string}
         */
        protocol: ['Oskari.mapframework.request.Request']
    }
);
