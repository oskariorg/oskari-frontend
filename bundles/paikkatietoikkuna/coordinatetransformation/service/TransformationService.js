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
            urlParameterString += "&exportSettings=" + JSON.stringify(exportSettings.selects);
        }
        return urlBase + urlParameterString;
    },
    formDataBuilder: function (importSettings, exportSettings){
        var file = file;
        var settings = settings;
        var formData = new FormData();
        if (exportSettings && exportSettings.selects){
            formData.append('exportSettings', JSON.stringify(exportSettings.selects));
        }
        if (importSettings && importSettings.selects){
            formData.append('importSettings', JSON.stringify(importSettings.selects));
        }
        if(importSettings.file){
            formData.append('coordFile', importSettings.file);
        }
        return formData;

    },
    handleError: function(callback, jqXHR){
        if (typeof callback !== "function"){
            return;
        }
        var resp,
            errorInfo;
        try {
            resp = JSON.parse(jqXHR.responseText);
            if(resp.info) {
                errorInfo = resp.info;
            }
        } catch(err) {
            Oskari.log(this.getName()).warn('Error whilst parsing json, error');
        }
        callback(errorInfo);
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
    transformFileToArray: function (crs, fileSettings, successCb, errorCb){
        var me = this;
        var url = this.requestUrlBuilder( crs, "F2A");
        var formData = this.formDataBuilder(fileSettings);
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
    readFileToArray: function (crs, fileSettings, successCb, errorCb){
        var me = this;
        var url = this.requestUrlBuilder(crs, "F2R");
        var formData = this.formDataBuilder(fileSettings);
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
        var me = this;
        var url = this.requestUrlBuilder( crs, "A2F", fileSettings);
        jQuery.ajax({
            contentType: "application/json",
            type: "POST",
            url: url,
            data: JSON.stringify(coords),
            success: function(response, textStatus, jqXHR) {
                var type = jqXHR.getResponseHeader('Content-Type');
                var filename = me.getFileNameFromResponse(jqXHR);
                successCb(response, filename, type);
            },
            error: function(jqXHR){
                me.handleError(errorCb, jqXHR);
            }
        });
    },
    transformFileToFile: function(crs, importSettings, exportSettings, successCb, errorCb ) {
        var me = this;
        var url = this.requestUrlBuilder( crs , "F2F");
        var formData = this.formDataBuilder(importSettings, exportSettings);
        jQuery.ajax({
            contentType: false, //multipart/form-data
            type: "POST",
            cache : false,
            processData: false,
            url: url,
            data: formData,
            success: function(response, textStatus, jqXHR) {
                var type = jqXHR.getResponseHeader('Content-Type');
                var filename = me.getFileNameFromResponse(jqXHR);
                successCb(response, filename, type);
            },
            error: function(jqXHR){
                me.handleError(errorCb, jqXHR);
            }
        });
    },
    getFileNameFromResponse: function (xhr){
        var disposition = xhr.getResponseHeader('Content-Disposition');
        var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        if (disposition){
            var matches = filenameRegex.exec(disposition);
            if (matches[1]){
                return matches[1];
            }
        }
        return "results.txt";
    }
}, {
    'protocol' : ['Oskari.mapframework.service.Service']
});
