/**
 * @class Oskari.mapframework.bundle.coordinatetool.CoordinateToolService
 */
Oskari.clazz.define('Oskari.coordinateconversion.ConversionService',
/**
 * @method create called automatically on construction
 * @static
 */
function(instance) {
    this._instance = instance;
    this._sandbox = instance.sandbox;
    this.urls = {};

    var ajaxUrl = this._sandbox.getAjaxUrl() + '&action_route=';
    this.urls.reverseGeocode = (ajaxUrl + 'GetConversionResult');
}, {
    __name: "coordinateconversion.ConversionService",
    __qname : "Oskari.coordinateconversion.ConversionService",
    getQName : function() {
        return this.__qname;
    },
    getName: function() {
        return this.__name;
    },
    /**
     * Initializes the service (does nothing atm).
     *
     * @method init
     */
    init: function() {},


    getConvertedCoordinates: function( payload, successCb, errorCb ) {
        successCb(payload.coords);
        // var url = urlFunction();
        // jQuery.ajax({
        //     url : url,
        //     type : 'GET',
        //     dataType : 'json',
        //     beforeSend: function(x) {
        //         if (x && x.overrideMimeType) {
        //             x.overrideMimeType("application/j-son;charset=UTF-8");
        //         }
        //     },
        //     success: function(response) {
        //         if (response) {
        //             me._handleResponse(response, successCb);
        //         }
        //     },
        //     error: function(jqXHR, textStatus) {
        //         if (_.isFunction(errorCb) && jqXHR.status !== 0) {
        //             errorCb(jqXHR, textStatus);
        //         }
        //     }
        // });
    },
    _handleResponse: function(response, cb) {
        cb(response);
    }
}, {
    'protocol' : ['Oskari.mapframework.service.Service']
});