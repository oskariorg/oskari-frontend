/**
 * @class Oskari.mapframework.request.common.RearrangeSelectedMapLayerRequest
 *
 * Requests that the given maplayer is moved to a new position in the selected maplayers stack.
 *
 * Requests are build and sent through Oskari.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.mapframework.request.common.RearrangeSelectedMapLayerRequest',

    /**
     * @method create called automatically on construction
     * @static
     *
     * @param {String}
     *            mapLayerId id of map layer used in
     * Oskari.mapframework.service.MapLayerService
     * @param {Number} toPosition
     *            new position index for the layer
     */

    function (mapLayerId, toPosition) {
        this._mapLayerId = mapLayerId;
        this._toPosition = toPosition;
    }, {
        /** @static @property __name request name */
        __name: "RearrangeSelectedMapLayerRequest",
        /**
         * @method getName
         * @return {String} request name
         */
        getName: function () {
            return this.__name;
        },

        /**
         * @method getMapLayerId
         * id for map layer used in
         * Oskari.mapframework.service.MapLayerService
         * @return {String}
         */
        getMapLayerId: function () {
            return this._mapLayerId;
        },

        /**
         * @method getToPosition
         * New position index for the layer
         * @return {Number}
         */
        getToPosition: function () {
            return this._toPosition;
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol': ['Oskari.mapframework.request.Request']
    });