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

    requestUrlBuilder: function ( crs, transformType, exportSettings ) {
        var urlBase = Oskari.urls.getRoute('CoordinateTransformation');
        var urlParameterString =
            "&sourceCrs=" + crs.sourceCrs +
            "&targetCrs=" + crs.targetCrs +
            "&targetDimension=" + crs.targetDimension +
            "&sourceDimension=" + crs.sourceDimension +
            "&transformType=" + transformType;

        if( crs.sourceElevationCrs ) {
            urlParameterString += "&sourceHeightCrs=" + crs.sourceElevationCrs;
        }
        if( crs.targetElevationCrs ) {
            urlParameterString += "&targetHeightCrs=" + crs.targetElevationCrs;
        }
        if (exportSettings){
            urlParameterString += "&exportSettings=" + JSON.stringify(exportSettings);
        }
        return urlBase + urlParameterString;
    },
    formDataBuilder: function (file, importSettings, exportSettings){
        var file = file;
        var settings = settings;
        var formData = new FormData();
        if (exportSettings){
            formData.append('exportSettings', JSON.stringify(exportSettings));
        }
        if (importSettings){
            formData.append('importSettings', JSON.stringify(importSettings));
        }
        formData.append('coordFile', file);
        return formData;

    },
    handleError: function(callback, jqXHR){
        if (typeof callback !== "function"){
            return;
        }
        var resp,
            text,
            code;
        try {
            resp = JSON.parse(jqXHR.responseText);
            text = resp.error;
            if(resp.info) {
                code = resp.info.error;
            }
        } catch(err) {
            Oskari.log(this.getName()).warn('Error whilst parsing json, error');
        }
        callback(text, code);
    },
    transformArrayToArray: function(coords, crs, successCb, errorCb ) {
        var me = this;
        var url = this.requestUrlBuilder( crs, "A2A" );

        jQuery.ajax({
            contentType: "application/json",
            type: "POST",
            url: url,
            data: JSON.stringify(coords),
            success: function(response) {
                successCb(response);
            },
            error: function(jqXHR){
                me.handleError(errorCb, jqXHR);
            }
        });
    },
    transformFileToArray: function (file, crs, fileSettings, successCb, errorCb){
        var url = this.requestUrlBuilder( crs, "F2A");
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
            error: function(jqXHR){
                me.handleError(errorCb, jqXHR);
            }
        });
    },
    transformArrayToFile: function(coords, crs, fileSettings, successCb, errorCb ) {
        var url = this.requestUrlBuilder( crs, "A2F", fileSettings);
        jQuery.ajax({
            contentType: "application/json",
            type: "POST",
            url: url,
            data: JSON.stringify(coords),
            success: function(response) {
                successCb(response);
            },
            error: function(jqXHR){
                me.handleError(errorCb, jqXHR);
            }
        });
    },
    transformFileToFile: function(file, crs, importSettings, exportSettings, successCb, errorCb ) {
        var url = this.requestUrlBuilder( crs , "F2F");
        var formData = this.formDataBuilder(file, importSettings, exportSettings);
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
            error: function(jqXHR){
                me.handleError(errorCb, jqXHR);
            }
        });
    }/*
    _handleResponse: function(response, cb) {
        cb(response);
    }*/
}, {
    'protocol' : ['Oskari.mapframework.service.Service']
});
