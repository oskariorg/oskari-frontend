/**
 * @class Oskari.statistics.bundle.statsgrid.StatisticsService
 * Methods for sending out events to display data in the grid
 * and to create a visualization of the data on the map.
 * Has a method for sending the requests to backend as well.
 */
Oskari.clazz.define('Oskari.statistics.bundle.statsgrid.StatisticsService',

    /**
     * @method create called automatically on construction
     * @static
     *
     */

    function (sandbox) {
        this.sandbox = sandbox;
        this.cache = {};

        // This object contains all the data source indicator metadata keyed by the plugin name.
        this.__indicatorsMetadata = {};
        this.__regionCategories = [];
        this.cacheSize = 0;
        this.callbackQueue = Oskari.clazz.create('Oskari.statistics.bundle.statsgrid.CallbackQueue');
    }, {
        __name: "StatsGrid.StatisticsService",
        __qname: "Oskari.statistics.bundle.statsgrid.StatisticsService",

        getQName: function () {
            return this.__qname;
        },

        getName: function () {
            return this.__name;
        },
        getSandbox: function () {
            return this.sandbox;
        },
        /**
         * @method init
         * Initializes the service
         */
        init: function () {

        },

        /**
         * @method sendStatsData
         * Sends an event with selected column and the data array.
         * @param {Object} layer Oskari layer which the visualization should be applied to
         * @param {Object} data The data which gets displayed in the grid
         */
        sendStatsData: function (layer, data) {
            var me = this,
                eventBuilder = me.sandbox.getEventBuilder('StatsGrid.StatsDataChangedEvent');
            if (eventBuilder) {
                var event = eventBuilder(layer, data);
                me.sandbox.notifyAll(event);
            }
        },

        /**
         * @method sendVisualizationData
         * Sends an event with params to build the visualization from.
         * @param {Object} layer Oskari layer which the visualization should be applied to
         * @param {Object} data The data for creating the visualization
         */
        sendVisualizationData: function (layer, data) {
            var me = this,
                eventBuilder = me.sandbox.getEventBuilder('MapStats.StatsVisualizationChangeEvent');
            if (eventBuilder) {
                var event = eventBuilder(layer, data);
                me.sandbox.notifyAll(event);
            }
        }
    }, {
        'protocol': ['Oskari.mapframework.service.Service']
    });
