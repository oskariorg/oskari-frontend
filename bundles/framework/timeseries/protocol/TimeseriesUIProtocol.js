/**
 * @class Oskari.mapframework.bundle.timeseries.TimeseriesUIProtocol
 *
 * Interface/protocol definition for Timeseries Control UI delegate
 */
Oskari.clazz.define('Oskari.mapframework.bundle.timeseries.TimeseriesUIProtocol',
/**
 * @method create called automatically on construction
 * @static
 *
 * Implement protocol, never instantiate
 */
function() {
    throw new Error("Oskari.mapframework.bundle.timeseries.TimeseriesUIProtocol should not be instantiated");
}, {
    /**
     * @method getTimes
     * Returns all available time instants that can be shown
     * @return {String[]} list of available timeseries times
     * @throws always override this
     */
    getTimes : function() {
        throw new Error("Implement your own");
    },
    /**
     * @method getCurrentTime
     * Returns current selected time instant
     * @return {String} current time as ISO-string
     * @throws always override this
     */
    getCurrentTime : function() {
        throw new Error("Implement your own");
    },
    /**
     * @method requestNewTime
     * Requests change in current selected time
     * @param {String} newTime change current time to this value(ISO string)
     * @param {String} nextTime time value at next animation frame(ISO string). Can be null if not animating
     * @param {function} doneCallback callback that will be called after new time has been loaded
     * @throws always override this
     */
    requestNewTime : function(newTime, nextTime, doneCallback) {
        throw new Error("Implement your own");
    }
});
