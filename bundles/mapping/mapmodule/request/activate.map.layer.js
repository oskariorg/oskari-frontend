/**
 * @class activate.map.layer.request
 *
 * Requests for given map layer to be activated/deactivated on map.
 * This means f.ex. a WFS layers to show featuretype grid and enable selection clicks on map
 *
 * Requests are build and sent through Oskari.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('activate.map.layer.request',

    /**
     * @method create called automatically on construction
     * @static
     *
     * @param {String}
     *            layerId id of the map layer (matching one in Oskari.mapframework.service.MapLayerService)
     * @param {Boolean}
     *            isActivated true if activated, false if deactivated
     */

    function (layerId, isActivated) {
        this._mapLayerId = layerId;
        this._isActivated = isActivated === true;
    }, {
        /** @static @property __name request name */
        __name: "activate.map.layer",
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
        getLayerId: function () {
            return this._mapLayerId;
        },
        /**
         * @method isActivated
         * @return {Boolean} true if activated, false if deactivated
         */
        isActivated: function () {
            return this._isActivated;
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol': ['Oskari.mapframework.request.Request']
    });
