/**
 * Sends data of a user indicator. Different data for different type of operation (create, update, delete)
 *
 * @class Oskari.statistics.bundle.statsgrid.event.UserIndicatorEvent
 */
Oskari.clazz.define('Oskari.statistics.bundle.statsgrid.event.UserIndicatorEvent',
    /**
     * @method create called automatically on construction
     * @static
     */

    function (_type, _indicator) {
        this._type = _type;
        this._indicator = _indicator;
    }, {
        /**
         * @method getName
         * Returns event name
         * @return {String} The event name.
         */
        getName: function () {
            return "StatsGrid.UserIndicatorEvent";
        },

        /**
         * Returns the type of operation ("create", "update" or "delete").
         *
         * @method getType
         * @return {String} returns the type of operation
         */
        getType: function() {
            return this._type;
        },

        /**
         * Returns the user indicator.
         *
         * @method getIndicator
         * @return {Object/null} returns the user indicator
         */
        getIndicator: function () {
            return this._indicator;
        }
    }, {
        'protocol': ['Oskari.mapframework.event.Event']
    });