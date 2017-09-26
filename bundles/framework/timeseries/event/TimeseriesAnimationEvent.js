/**
 * @class Oskari.mapframework.bundle.timeseries.TimeseriesAnimationEvent
 *
 * Event is sent when timeseries enabled layer advances/stops animation
 */
Oskari.clazz.define('Oskari.mapframework.bundle.timeseries.TimeseriesAnimationEvent',
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
