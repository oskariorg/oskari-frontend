/**
 * Used to notify that datasource or it's indicators have been added or removed.
 *
 * @class Oskari.statistics.statsgrid.event.DatasourceEvent
 */
Oskari.clazz.define('Oskari.statistics.statsgrid.event.DatasourceEvent',
    /**
     * @method create called automatically on construction
     * @static
     */
    function (datasource) {
        this.datasource = datasource;
    }, {
        /**
         * @method getName
         * Returns event name
         * @return {String} The event name.
         */
        getName : function () {
            return "StatsGrid.DatasourceEvent";
        },
        getDatasource : function() {
            return this.datasource;
        }
    }, {
        'protocol': ['Oskari.mapframework.event.Event']
    });