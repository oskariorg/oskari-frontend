/**
 * Start when dom ready
 */
jQuery(document).ready(function() {
    if(!ajaxUrl) {
        jQuery('#mapdiv').append('Unable to start');
        return;
    }

    function getURLParameter(name) {
        var value = (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1];
        if(value) {
            return decodeURI(value);
        }
    }
    // returns empty string if parameter doesn't exist
    // otherwise returns '<param>=<param value>&'
    function getAdditionalParam(param) {
        var value = getURLParameter(param);
        if (value) {
            return param + '=' + value + '&';
        }
        return '';
    }

    if (ajaxUrl.indexOf('http') == 0) {
        var hostIdx = ajaxUrl.indexOf('://') + 3;
        var pathIdx = ajaxUrl.indexOf('/', hostIdx);
        ajaxUrl = ajaxUrl.substring(pathIdx);
    }

    // populate url with possible control parameters
    var getAppSetupParams = {};
    if(typeof window.controlParams == 'object') {
        for(var key in controlParams) {
            getAppSetupParams[key] = controlParams[key];
        }
    }

    function gfiParamHandler(sandbox) {
        if(getURLParameter('showGetFeatureInfo') != 'true') {
            return;
        }
        // getPixelFromCoordinate should be part of mapmodule instead of doing ol3-specific code here
        // for some reason a timeout is required, but this is a hacky feature anyway
        // TODO: refactor to be more useful.GetFeatureInfoRequest shouldn't take both coordinates and pixels but one or the other
        // otherwise we should check if the pixels and coordinates do actually match
        setTimeout(function() {
          var lon  = sandbox.getMap().getX();
          var lat  = sandbox.getMap().getY();
          var mapModule = sandbox.findRegisteredModuleInstance('MainMapModule');
          var px = mapModule.getMap().getPixelFromCoordinate([lon, lat]);
          if(px) {
            sandbox.postRequestByName('MapModulePlugin.GetFeatureInfoRequest', [lon, lat, px[0], px[1]]);
          }
        }, 500);

    }

    jQuery.ajax({
        type: 'POST',
        dataType: 'json',
        data : getAppSetupParams,
        url: ajaxUrl + 'action_route=GetAppSetup',
        success: function (appSetup) {
            var app = Oskari.app;
            if (!appSetup.startupSequence) {
                jQuery('#mapdiv').append('Unable to start');
                return;
            }
            app.init(appSetup);
            app.startApplication(function () {
                var sb = Oskari.getSandbox();
                gfiParamHandler(sb);
            });
        },
        error: function (jqXHR, textStatus) {
            if (jqXHR.status !== 0) {
                jQuery('#mapdiv').append('Unable to start');
            }
        }
    });
});