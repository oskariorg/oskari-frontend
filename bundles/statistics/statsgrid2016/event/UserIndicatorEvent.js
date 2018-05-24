/**
 * Used to notify that user has added or removed own indicator.
 *
 * @class Oskari.statistics.statsgrid.event.UserIndicatorEvent
 */
Oskari.clazz.define('Oskari.statistics.statsgrid.event.UserIndicatorEvent',
    /**
     * @method create called automatically on construction
     * @static
     */
    function (indicator, removed) {
        this.indicator = indicator;
        this.wasAdded = !removed;
    }, {
        /**
         * @method getName
         * Returns event name
         * @return {String} The event name.
         */
        getName: function () {
            return 'StatsGrid.UserIndicatorEvent';
        },
        /**
         * True if the indicator was removed
         * @return {Boolean}
         */
        isRemoved: function () {
            return !this.wasAdded;
        },
        /**
         * Indicator id
         * @return {Number}
         */
        getIndicator: function () {
            return this.indicator;
        }
    }, {
        'protocol': ['Oskari.mapframework.event.Event']
    });
