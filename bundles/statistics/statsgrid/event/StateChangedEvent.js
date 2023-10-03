/**
 * Used to notify that state services whole state is changed.
 *
 * @class Oskari.statistics.statsgrid.event.StateChangedEvent
 */
Oskari.clazz.define('Oskari.statistics.statsgrid.event.StateChangedEvent',
    /**
     * @method create called automatically on construction
     * @static
     */
    function (reset = false) {
        this.reset = reset;
    }, {
        /**
         * @method getName
         * Returns event name
         * @return {String} The event name.
         */
        getName: function () {
            return 'StatsGrid.StateChangedEvent';
        },
        isReset: function () {
            return this.reset;
        }
    }, {
        'protocol': ['Oskari.mapframework.event.Event']
    });
