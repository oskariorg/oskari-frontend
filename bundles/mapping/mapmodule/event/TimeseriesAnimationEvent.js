/**
 * @class Oskari.mapframework.bundle.mapmodule.event.TimeseriesAnimationEvent
 *
 * Event is sent when decides to
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.event.TimeseriesAnimationEvent',
    /**
     * @method create called automatically on construction
     * @static
     */
    function(layerId, time, playing) {
        this._layerId = layerId;
        this._time = time;
        this._playing = playing;
    }, {
        /** @static @property __name event name */
        __name: "TimeseriesAnimationEvent",
        /**
         * @method getName
         * @return {String} the name for the event
         */
        getName: function() {
            return this.__name;
        },
        getLayerId: function() {
            return this._layerId;
        },
        getTime: function() {
            return this._time;
        },
        getPlaying: function() {
            return this._playing;
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol': ['Oskari.mapframework.event.Event']
    });
