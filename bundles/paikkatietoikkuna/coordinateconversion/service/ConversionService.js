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
        jQuery.ajax({
           dataType: "json",
           type: "POST",
           url: "/action?action_route=CoordinateTransformation&",
           data: {
               "sourceCrs": payload.sourceCrs,
               "heightCrs": "10",
               "targetCrs": payload.targetCrs,
               "coords": JSON.stringify(payload.coords)
           },
           success: function(response) {
               successCb(response);
           }
       });
    },
    _handleResponse: function(response, cb) {
        cb(response);
    }
}, {
    'protocol' : ['Oskari.mapframework.service.Service']
});