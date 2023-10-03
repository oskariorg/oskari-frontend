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
    function (current, changed = {}) {
        this.current = current;
        this.changed = changed;
    }, {
        /**
         * @method getName
         * Returns event name
         * @return {String} The event name.
         */
        getName: function () {
            return 'StatsGrid.ClassificationChangedEvent';
        },
        /**
         * Active indicator's classification
         * @return {Object}
         */
        getCurrent: function () {
            return this.current;
        },
        /**
         * Updated value
         * @return {Object}
         */
        getChanged: function () {
            return this.changed;
        }
    }, {
        'protocol': ['Oskari.mapframework.event.Event']
    });
