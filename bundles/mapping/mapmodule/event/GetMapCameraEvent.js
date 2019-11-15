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
        this._name = name;
        this._camera = camera;
    }, {
        /** @static @property __name event name */
        __name: 'MapTourEvent',

        /**
         * @method getName
         * @return {String} event name
         */
        getName: function () {
            return this.__name;
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol': ['Oskari.mapframework.event.Event']
    });
