/**
 * Used to notify that an indicator has been added to or removed from selected indicators.
 *
 * @class Oskari.statistics.statsgrid.event.IndicatorEvent
 */
Oskari.clazz.define('Oskari.statistics.statsgrid.event.IndicatorEvent',
    /**
     * @method create called automatically on construction
     * @static
     */
    function (datasource, indicator, selections, removed) {
        this.datasource = datasource;
        this.indicator = indicator;
        this.selections = selections;
        this.wasAdded = !removed;
    }, {
        /**
         * @method getName
         * Returns event name
         * @return {String} The event name.
         */
        getName : function () {
            return "StatsGrid.IndicatorEvent";
        },
        /**
         * True if the indicator was removed
         * @return {Boolean}
         */
        isRemoved : function() {
            return !this.wasAdded;
        },
        /**
         * Datasource id
         * @return {Number}
         */
        getDatasource : function() {
            return this.datasource;
        },
        /**
         * Indicator id
         * @return {Number}
         */
        getIndicator : function() {
            return this.indicator;
        },
        /**
         * Selections that user selected for indicator
         * @return {Object} key is selection id, value is the selected value
         */
        getSelections : function() {
            return this.selections || {};
        }
    }, {
        'protocol': ['Oskari.mapframework.event.Event']
    });