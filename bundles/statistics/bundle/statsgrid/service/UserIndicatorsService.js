/**
 * Bunch of methods dealing with user's indicators.
 * Handles fetching, creating, updating and deleting indicators.
 *
 * @class Oskari.statistics.bundle.statsgrid.UserIndicatorsService
 */
Oskari.clazz.define('Oskari.statistics.bundle.statsgrid.UserIndicatorsService', 

/**
 * @method create called automatically on construction
 * @static
 * 
 */
function(instance) {
    this.instance = instance;
    this.sandbox = instance.sandbox;
}, {
    __name: "StatsGrid.UserIndicatorsService",
    __qname : "Oskari.statistics.bundle.statsgrid.UserIndicatorsService",

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

    getUserIndicators: function(successCb, errorCb) {
        // TODO: fetch the indicators from the DB
    },

    getUserIndicator: function(indicatorId, successCb, errorCb) {
        // TODO: fetch the indicator from the DB
    },

    saveUserIndicator: function(indicator, successCb, errorCb) {
        // TODO: save the indicator to the DB
    },

    deleteUserIndicator: function(indicatorId, successCb, errorCb) {
        // TODO: delete the indicator from the DB
    }
}, {
    'protocol' : ['Oskari.mapframework.service.Service']
});