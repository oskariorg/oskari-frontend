/**
 * @class Oskari.mapframework.event.common.TimeChangedEvent
 */
Oskari.clazz.define('Oskari.mapframework.event.common.MapTourEvent',
    /**
     * @static @method create called automatically on construction
     */
    function (time) {
        this._time = time;
    }, {
        /** @static @property __name event name */
        __name: 'MapTourEvent',

        /**
         * @method getName
         * @return {String} event name
         */
        getName: function () {
            return this.__name;
        },

        getTime: function () {
            return this._time;
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        protocol: ['Oskari.mapframework.event.Event']
    });
