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
function(instance) {
    this.instance = instance;
    this.sandbox = instance.sandbox;
}, {
    __name: "StatsGrid.StatisticsService",
    __qname : "Oskari.statistics.bundle.statsgrid.StatisticsService",

    getQName : function() {
        return this.__qname;
    },

    getName: function() {
        return this.__name;
    },

    /**
     * @method init
     * Initializes the service
     */
    init: function() {

    },

    /**
     * @method sendStatsData
     * Sends an event with selected column and the data array.
     * @param {Object} layer Oskari layer which the visualization should be applied to
     * @param {Object} data The data which gets displayed in the grid
     */
    sendStatsData: function(layer, data) {
        var me = this;
        var eventBuilder = me.sandbox.getEventBuilder('StatsGrid.SotkadataChangedEvent');
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
    sendVisualizationData: function(layer, data) {
        var me = this;
        var eventBuilder = me.sandbox.getEventBuilder('MapStats.StatsVisualizationChangeEvent');
        if (eventBuilder) {
            var event = eventBuilder(layer, data);
            me.sandbox.notifyAll(event);
        }
    },

    /**
     * @method fetchStatsData
     * Make the AJAX call. This method helps
     * if we need to do someting for all the calls to backend.
     *
     * param url to correct action route
     * param successCb (success callback)
     * param errorCb (error callback)
     */
    fetchStatsData : function(url, successCb, errorCb) {
        jQuery.ajax({
            type : "GET",
            dataType : 'json',
            beforeSend : function(x) {
                if (x && x.overrideMimeType) {
                    x.overrideMimeType("application/j-son;charset=UTF-8");
                }
            },
            url : url,
            success : function(pResp) {
                if (successCb) {
                    successCb(pResp);
                }
            },
            error : function(jqXHR, textStatus) {
                if (errorCb && jqXHR.status != 0) {
                    errorCb(jqXHR, textStatus);
                }
            }
        });
    }

}, {
    'protocol' : ['Oskari.mapframework.service.Service']
});