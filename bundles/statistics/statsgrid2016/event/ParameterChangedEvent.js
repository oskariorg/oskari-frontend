/**
 * Notifies when an indicator selection has been changed.
 *
 * @class Oskari.statistics.statsgrid.event.ParameterChangedEvent
 */
Oskari.clazz.define('Oskari.statistics.statsgrid.event.ParameterChangedEvent',
    /**
     * @method create called automatically on construction
     * @static
     */
    function () {
    }, {
        /**
         * @method getName
         * Returns event name
         * @return {String} The event name.
         */
        getName: function () {
            return 'StatsGrid.ParameterChangedEvent';
        }
    }, {
        'protocol': ['Oskari.mapframework.event.Event']
    });
