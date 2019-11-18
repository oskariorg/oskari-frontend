/**
 * @class Oskari.mapframework.event.common.GetMapCameraEvent
 *
 * Notifies application bundles that a map has moved.
 * See Oskari.mapframework.request.common.GetMapCameraRequest
 */
Oskari.clazz.define('Oskari.mapframework.event.common.GetMapCameraEvent',

    /**
     * @static @method create called automatically on construction
     */
    function (name, camera) {
        this._locationName = name;
        this._camera = camera;
    }, {
        /** @static @property __name event name */
        __name: 'GetMapCameraEvent',

        /**
         * @method getName
         * @return {String} event name
         */
        getName: function () {
            return this.__name;
        },

        /**
         * @method getLocationName
         * @return {String} user set location name
         */
        getLocationName: function () {
            return this._locationName;
        },

        /**
         * @method getCamera
         * @return {Object} location and orientation of requested spot
         */
        getCamera: function () {
            return this._camera;
        },

        /**
         * @method getLocation
         * @return {Object} location of requested spot, x y and altitude
         */
        getLocation: function () {
            return this.getCamera().location;
        },

        /**
         * @method getCameraAngle
         * @return {Object} object with heading pitch and roll
         */
        getCameraAngle: function () {
            return this.getCamera().orientation;
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol': ['Oskari.mapframework.event.Event']
    });
