/**
 * Notifies when an current visualization theme has been changed.
 * Components listing indicators should update a theming.
 *
 * @class Oskari.statistics.statsgrid.event.ClassificationChangedEvent
 */
Oskari.clazz.define('Oskari.statistics.statsgrid.event.ClassificationChangedEvent',
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
            return 'StatsGrid.ClassificationChangedEvent';
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