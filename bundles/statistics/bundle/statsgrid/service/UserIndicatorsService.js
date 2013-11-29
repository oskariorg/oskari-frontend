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

    userIndicators: [
        {
            "id": 1,
            "title": {
                "fi": "Testi 1"
            },
            "description": {
                "fi": "Testi-indikaattori no. 1"
            },
            "organization": {
                "fi": "Testi inc."
            },
            "public": true,
            "layerId": 519,
            "year": 2013,
            "data": [
                {"region": 2, "code": "005", "primary value": "1.0"},
                {"region": 4, "code": "009", "primary value": "2.0"},
                {"region": 5, "code": "010", "primary value": "2.3"},
                {"region": 9, "code": "016", "primary value": "1.1"},
                {"region": 11, "code": "018", "primary value": "0.4"},
                {"region": 12, "code": "019", "primary value": "6.2"}
            ]
        }
    ],

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
        successCb(this.userIndicators);
        //this._get(url, successCb, errorCb);
    },

    getUserIndicator: function(indicatorId, successCb, errorCb) {
        var url = this.sandbox.getAjaxUrl() + 'action_route=GetUserIndicators&id=' + indicatorId;
        successCb(this.userIndicators[0]);
        //this._get(url, successCb, errorCb);
    },

    saveUserIndicator: function(indicator, successCb, errorCb) {
        var url = this.sandbox.getAjaxUrl() + 'action_route=SaveUserIndicator';

        this._post(url, indicator, successCb, errorCb);
    },

    deleteUserIndicator: function(indicatorId, successCb, errorCb) {
        // TODO: delete the indicator from the DB
    },

    _get: function(url, successCb, errorCb) {
        jQuery.ajax({
            type : "GET",
            dataType : 'json',
            beforeSend : function(x) {
                if (x && x.overrideMimeType) {
                    x.overrideMimeType("application/j-son;charset=UTF-8");
                }
            },
            url : url,
            success : function(response) {
                if (typeof successCb === 'function') successCb(response);
            },
            error : function(jqXHR, textStatus) {
                if (typeof errorCb === 'function' && jqXHR.status != 0) errorCb(jqXHR, textStatus);
            }
        });
    },

    _post: function(url, data, successCb, errorCb) {
        jQuery.ajax({
            type : "POST",
            data: data,
            dataType : 'json',
            beforeSend : function(x) {
                if (x && x.overrideMimeType) {
                    x.overrideMimeType("application/j-son;charset=UTF-8");
                }
            },
            url : url,
            success : function(response) {
                if (typeof successCb === 'function') successCb(response);
            },
            error : function(jqXHR, textStatus) {
                if (typeof errorCb === 'function' && jqXHR.status != 0) errorCb(jqXHR, textStatus);
            }
        });
    }
}, {
    'protocol' : ['Oskari.mapframework.service.Service']
});