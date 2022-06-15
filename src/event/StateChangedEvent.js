/**
 * @class Oskari.event.StateChangedEvent
 *
 * Event is sent after massive application state change occurs
 *  (like reseting whole app to default or setting app state via mydata/saved views).
 */
Oskari.clazz.define('Oskari.event.StateChangedEvent',
    /**
     * @method create called automatically on construction
     * @static
     */
    function (newState, oldState) {
        this._state = newState;
        this._previousState = oldState;
    }, {
        __name: 'StateChangedEvent',

        getName: function () {
            return this.__name;
        },

        getState: function () {
            return this._state;
        },

        getPreviousState: function () {
            return this._previousState;
        },
        /**
         * Serialization for RPC
         * @return {Object} object has keys for current and previous state
         */
        getParams: function () {
            return {
                current: this.getState(),
                previous: this.getPreviousState()
            };
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol': ['Oskari.mapframework.event.Event']
    });
