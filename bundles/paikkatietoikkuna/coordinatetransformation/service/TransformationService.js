/**
 * @class Oskari.mapframework.bundle.coordinatetool.CoordinateToolService
 */
Oskari.clazz.define('Oskari.coordinatetransformation.TransformationService',
/**
 * @method create called automatically on construction
 * @static
 */
function(instance) {
    this._instance = instance;
    this._sandbox = instance.sandbox;
    this.urls = {};

    this.urls.result = Oskari.urls.getRoute('GetConversionResult');
}, {
    __name: "coordinatetransformation.TransformationService",
    __qname : "Oskari.coordinatetransformation.TransformationService",
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

    requestUrlBuilder: function ( payload ) {
        var urlBase = "action?action_route=CoordinateTransformation";
        var urlParameterString = "";

        if( payload.sourceCrs ) {
            urlParameterString = urlParameterString.concat("&sourceCrs="+payload.sourceCrs);
        }
        if( payload.sourceElevationCrs ) {
            urlParameterString = urlParameterString.concat("&sourceHeightCrs="+payload.sourceElevationCrs);
        }
        if( payload.targetCrs ) {
            urlParameterString = urlParameterString.concat("&targetCrs="+payload.targetCrs);
        }
        if( payload.targetElevationCrs ) {
            urlParameterString = urlParameterString.concat("&targetHeightCrs="+payload.targetElevationCrs);
        }
        var url = urlBase.concat(urlParameterString);
        return url;
    },
    getConvertedCoordinates: function( payload, successCb, errorCb ) {
        var url = this.requestUrlBuilder( payload );
        jQuery.ajax({
            contentType: "application/json",
            type: "POST",
            url: url,
            data: JSON.stringify(payload.coords),
            success: function(response) {
                successCb(response);
            },
            error: function(){
                errorCb(); //TODO errorCodes??
            }
        });
    },
    _handleResponse: function(response, cb) {
        cb(response);
    }
}, {
    'protocol' : ['Oskari.mapframework.service.Service']
});