/**
 * Used to notify that a filter has been applied
 */
Oskari.clazz.define('Oskari.statistics.statsgrid.event.Filter',
    /**
     * @method create called automatically on construction
     * @static
     */
    function ( filter ) {
        this.filter = filter;
    }, {
        /**
         * @method getName
         * Returns event name
         * @return {String} The event name.
         */
        getName : function () {
            return "StatsGrid.Filter";
        },
        getFilter : function () {
            return this.filter;
        }
    }, {
        'protocol': ['Oskari.mapframework.event.Event']
    });