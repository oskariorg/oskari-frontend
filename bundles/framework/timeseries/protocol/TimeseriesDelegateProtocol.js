/**
 * @class Oskari.mapframework.bundle.timeseries.TimeseriesDelegateProtocol
 *
 * Interface/protocol definition for Timeseries Control UI delegate
 */
Oskari.clazz.define('Oskari.mapframework.bundle.timeseries.TimeseriesDelegateProtocol',
    /**
     * @method create called automatically on construction
     * @static
     *
     * Implement protocol, never instantiate
     */
    function () {
        throw new Error("Oskari.mapframework.bundle.timeseries.TimeseriesDelegateProtocol should not be instantiated");
    }, {
        /**
         * @method getTimes
         * Returns all available time instants that can be shown
         * @return {String[]} list of available timeseries time instants as ISO-strings
         * @throws always override this
         */
        getTimes: function () {
            throw new Error("Implement your own");
        },
        /**
         * @method getCurrentTime
         * Returns current selected time instant
         * @return {String} current time as ISO-string
         * @throws always override this
         */
        getCurrentTime: function () {
            throw new Error("Implement your own");
        },
        /**
         * @method getSubsetRange
         * Returns current selected time range subset
         * @return {String[]} range Array with 2 elements, start & end, ISO-string
         * @throws always override this
         */
        getSubsetRange: function () {
            throw new Error("Implement your own");
        },
        /**
         * @method setSubsetRange
         * Set current selected time range subset
         * @param {String[]} range Array with 2 elements, start & end, ISO-string
         * @throws always override this
         */
        setSubsetRange: function (range) {
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
        requestNewTime: function (newTime, nextTime, doneCallback) {
            throw new Error("Implement your own");
        },
        /**
         * @method destroy
         * Releases any event handlers and any other resources
         * @throws always override this
         */
        destroy: function () {
            throw new Error("Implement your own");
        }
    });
