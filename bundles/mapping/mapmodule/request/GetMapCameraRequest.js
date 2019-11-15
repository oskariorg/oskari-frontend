/**
 * @class Oskari.mapframework.request.common.GetMapCameraRequest
 */
Oskari.clazz.define('Oskari.mapframework.request.common.GetMapCameraRequest',
    /**
     * @static @method create called automatically on construction
     *
     * @param {Object} options
     *          object with options
     */
    function (locationName) {
        this._locationName = locationName;
    }, {
        /** @static @property {String} __name request name */
        __name: 'GetMapCameraRequest',

        /**
         * @method getName
         * @return {String} request name
         */
        getName: function () {
            return this.__name;
        },

        /**
         * @method getLocationName
         * @return {String} location name
         */
        getLocationName: function () {
            return this._locationName || '';
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        protocol: ['Oskari.mapframework.request.Request']
    });
