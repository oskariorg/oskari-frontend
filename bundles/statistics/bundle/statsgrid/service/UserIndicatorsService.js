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
        var url = this.sandbox.getAjaxUrl() + 'action_route=GetUserIndicators';
        this._get(url, successCb, errorCb);
    },

    getUserIndicator: function(indicatorId, successCb, errorCb) {
        var url = this.sandbox.getAjaxUrl() + 'action_route=GetUserIndicators&id=' + indicatorId;
        this._get(url, successCb, errorCb);
    },

    saveUserIndicator: function(indicator, successCb, errorCb) {
        var url = this.sandbox.getAjaxUrl() + 'action_route=SaveUserIndicator';
        this._post(url, indicator, successCb, errorCb);
    },

    deleteUserIndicator: function(indicatorId, successCb, errorCb) {
        var url = this.sandbox.getAjaxUrl() + 'action_route=DeleteUserIndicator&id=' + indicatorId;
        this._get(url, successCb, errorCb);
    },

    _get: function(url, successCb, errorCb) {
        this._ajax("GET", url, successCb, errorCb);
    },

    _post: function(url, data, successCb, errorCb) {
        this._ajax("POST", url, successCb, errorCb, data);
    },

    _ajax: function(method, url, successCb, errorCb, data) {
        var params = {
            url : url,
            type : method,
            dataType : 'json',
            beforeSend : function(x) {
                if (x && x.overrideMimeType) {
                    x.overrideMimeType("application/j-son;charset=UTF-8");
                }
            },
            success : function(response) {
                if (typeof successCb === 'function') successCb(response);
            },
            error : function(jqXHR, textStatus) {
                if (typeof errorCb === 'function' && jqXHR.status != 0) errorCb(jqXHR, textStatus);
            }
        };

        if (data) params.data = data;

        jQuery.ajax(params);
    }
}, {
    'protocol' : ['Oskari.mapframework.service.Service']
});