/**
 * @class Oskari.analysis.bundle.analyse.AnalyseService
 * Methods for sending out analysis data to backend
 */
Oskari.clazz.define('Oskari.analysis.bundle.analyse.service.AnalyseService',

/**
 * @method create called automatically on construction
 * @static
 * 
 */
function(instance) {
    this.instance = instance;
    this.sandbox = instance.sandbox;
}, {
    __name: "Analyse.AnalyseService",
    __qname : "Oskari.analysis.bundle.analyse.service.AnalyseService",

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
     * Sends the data to backend for analysis.
     *
     * @method sendAnalyseData
     * @param {Object} data the data to send
     * @param {Function} success the success callback
     * @param {Function} failure the failure callback
     */
    sendAnalyseData: function(data, success, failure) {
        var url = this.sandbox.getAjaxUrl() + 'action_route=CreateAnalysisLayer';
        jQuery.ajax({
            type : 'POST',
            dataType: 'json',
            url : url,
            beforeSend : function(x) {
                if (x && x.overrideMimeType) {
                    x.overrideMimeType("application/j-son;charset=UTF-8");
                }
            },
            data : {'analyse': data},
            success : success,
            error : failure
        });
    }

}, {
    'protocol' : ['Oskari.mapframework.service.Service']
});