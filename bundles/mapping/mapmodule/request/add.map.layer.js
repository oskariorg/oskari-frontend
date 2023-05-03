/**
 * @class Oskari.mapframework.request.common.AddMapLayerRequest
 *
 * Requests for given map layer to be added on map. Opposite of
 * Oskari.mapframework.request.common.RemoveMapLayerRequest
 *
 * Requests are build and sent through Oskari.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.mapframework.request.common.AddMapLayerRequest',
    /**
     * @method create called automatically on construction
     * @static
     *
     * @param {String}
     *            mapLayerId id of the map layer (matching one in Oskari.mapframework.service.MapLayerService)
     */

    function (mapLayerId, options) {
        this._creator = null;
        this._mapLayerId = mapLayerId;
        this._options = options;
    }, {
        /** @static @property __name request name */
        __name: 'AddMapLayerRequest',

        /**
         * @method getName
         * @return {String} request name
         */
        getName: function () {
            return this.__name;
        },
        /**
         * @method getMapLayerId
         * @return {String} id for map layer used in Oskari.mapframework.service.MapLayerService
         */
        getMapLayerId: function () {
            return this._mapLayerId;
        },
        getOptions: function () {
            return this._options || {};
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        protocol: ['Oskari.mapframework.request.Request']
    });
