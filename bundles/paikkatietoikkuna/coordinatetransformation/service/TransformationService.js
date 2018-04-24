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

    requestUrlBuilder: function ( crs ) {
        var urlBase = "action?action_route=CoordinateTransformation";
        var urlParameterString = "";

        if( crs.sourceCrs ) {
            urlParameterString += "&sourceCrs=" + crs.sourceCrs;
        }
        if( crs.sourceElevationCrs ) {
            urlParameterString += "&sourceHeightCrs=" + crs.sourceElevationCrs;
        }
        if( crs.targetCrs ) {
            urlParameterString += "&targetCrs=" + crs.targetCrs;
        }
        if( crs.targetElevationCrs ) {
            urlParameterString += "&targetHeightCrs=" + crs.targetElevationCrs;
        }
        return urlBase + urlParameterString;
    },
    formDataBuilder: function (file, settings){
        var file = file;
        var settings = settings;
        var formData = new FormData();
        //formData.append('sourceCrs', crs.source);
        //formData.append('sourceElevationCrs', crs.sourceElevation);
        //formData.append('targetCrs', crs.target);
        //formData.append('targetElevationCrs', crs.targetElevation);
        //
        if (settings.export){
            formData.append('exportSettings', settings.export);
        }
        if (settings.import){
            formData.append('importSettings', settings.import);
        }
        formData.append('coordFile', file);
        return formData;

    },
    transformArrayToArray: function(coords, crs, successCb, errorCb ) {
        var url = this.requestUrlBuilder( crs );
        jQuery.ajax({
            contentType: "application/json",
            type: "POST",
            url: url,
            data: JSON.stringify(coords),
            success: function(response) {
                successCb(response);
            },
            error: function(){
                errorCb(); //TODO errorCodes??
            }
        });
    },
    transformFileToArray: function (file, crs, fileSettings, successCb, errorCb){
        var url = this.requestUrlBuilder( crs);
        var formData = this.formDataBuilder(file, fileSettings);
         jQuery.ajax({
            contentType: false, //multipart/form-data
            type: "POST",
            cache : false,
            processData: false,
            url: url,
            data: formData,
            success: function(response) {
                successCb(response);
            },
            error: function(){
                errorCb(); //TODO errorCodes??
            }
        });
    },
    transformArrayToFile: function(coords, crs, fileSettings, successCb, errorCb ) {
        var url = this.requestUrlBuilder( crs );
        jQuery.ajax({
            contentType: "application/json",
            type: "POST",
            url: url,
            data: JSON.stringify(coords),
            success: function(response) {
                successCb(response);
            },
            error: function(){
                errorCb(); //TODO errorCodes??
            }
        });
    },
    transformFileToFile: function(file, crs, fileSettings, successCb, errorCb ) {
        var url = this.requestUrlBuilder( crs );
        var formData = this.formDataBuilder(file, fileSettings);
        jQuery.ajax({
            contentType: false, //multipart/form-data
            type: "POST",
            cache : false,
            processData: false,
            url: url,
            data: formData,
            success: function(response) {
                successCb(response);
            },
            error: function(){
                errorCb(); //TODO errorCodes??
            }
        });
    }/*
    _handleResponse: function(response, cb) {
        cb(response);
    }*/
}, {
    'protocol' : ['Oskari.mapframework.service.Service']
});
