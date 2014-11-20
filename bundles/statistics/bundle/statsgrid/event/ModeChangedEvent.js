/**
 * Used to notify other components of StatsGrid mode changes.
 *
 * @class Oskari.statistics.bundle.statsgrid.event.ModeChangedEvent
 */
Oskari.clazz.define('Oskari.statistics.bundle.statsgrid.event.ModeChangedEvent',
    /**
     * @method create called automatically on construction
     * @static
     * @param {Boolean} isVisible True id mode's visible, false otherwise
     */
    function (isVisible) {
        this._modeVisible = isVisible;
    }, {
        /**
         * @method getName
         * Returns event name
         * @return {String} The event name.
         */
        getName: function () {
            return 'StatsGrid.ModeChangedEvent';
        },
        /**
         * @method isModeVisible
         * Returns true if the mode is visible.
         * @return {Boolean}
         */
        isModeVisible: function () {
            return this._modeVisible;
        }
    }, {
        'protocol': ['Oskari.mapframework.event.Event']
    });
