/**
 * Notifies when an indicator has been selected (in grid etc).
 * Components listing indicators should update a "highlighted" indicator if needed.
 *
 * @class Oskari.statistics.statsgrid.event.ActiveIndicatorChangedEvent
 */
Oskari.clazz.define('Oskari.statistics.statsgrid.event.ActiveIndicatorChangedEvent',
    /**
     * @method create called automatically on construction
     * @static
     */
    function (current, previous) {
        this.current = current;
        this.previous = previous;
    }, {
        /**
         * @method getName
         * Returns event name
         * @return {String} The event name.
         */
        getName : function () {
            return "StatsGrid.ActiveIndicatorChangedEvent";
        },
        /**
         * Current active indicator
         * @return {Object}
         */
        getCurrent : function() {
            return this.current;
        },
        /**
         * Previously active indicator
         * @return {Object}
         */
        getPrevious : function() {
            return this.previous;
        }
    }, {
        'protocol': ['Oskari.mapframework.event.Event']
    });