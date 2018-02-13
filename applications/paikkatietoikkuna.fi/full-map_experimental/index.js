/**
 * Start when dom ready
 */
jQuery(document).ready(function () {
    "use strict";
    var getAppSetupParams = {},
        key,
        hostIdx,
        pathIdx;
    if (!ajaxUrl) {
        alert('Ajax URL not set - cannot proceed');
        return;
    }

    function getURLParameter(name) {
        var re = name + '=' + '([^&]*)(&|$)',
            value = new RegExp(re).exec(location.search);
        if (value && value.length && value.length > 1) {
            value = value[1];
        }
        if (value) {
            return decodeURI(value);
        }
        return null;
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

    // remove host part from url
    if (ajaxUrl.indexOf('http') === 0) {
        hostIdx = ajaxUrl.indexOf('://') + 3;
        pathIdx = ajaxUrl.indexOf('/', hostIdx);
        ajaxUrl = ajaxUrl.substring(pathIdx);
    }

    // populate url with possible control parameters
    if (typeof window.controlParams === 'object') {
        for (key in window.controlParams) {
            if (window.controlParams.hasOwnProperty(key)) {
                getAppSetupParams[key] = window.controlParams[key];
            }
        }
    }

    function gfiParamHandler(sandbox) {
        if (getURLParameter('showGetFeatureInfo') !== 'true') {
            return;
        }
        var lon = sandbox.getMap().getX(),
            lat = sandbox.getMap().getY(),
            mapModule = sandbox.findRegisteredModuleInstance('MainMapModule'),
            px = mapModule.getMap().getViewPortPxFromLonLat({
                lon: lon,
                lat: lat
            });
        sandbox.postRequestByName('MapModulePlugin.GetFeatureInfoRequest', [lon, lat, px.x, px.y]);
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

            terribleHackToBeRemoved(appSetup.configuration, appSetup.env.lang || window.language);

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

// This should be removed in 1.45 version of Oskari!!!
// currently personaldata, publisher, analysis etc require
// bundle-specific config for login/register urls
// Should be changed so that Oskari.getURLs() could be used as a generic config/environment
    function terribleHackToBeRemoved(conf, lang) {
        if(!conf.personaldata) {
            conf.personaldata = {};
        }
        if(!conf.personaldata.conf) {
            conf.personaldata.conf = {};
        }
        if(!conf.personaldata.conf.logInUrl) {
            conf.personaldata.conf.logInUrl = '/auth';
            // personal data doesn't support registration link
        }

        if(!conf.analyse) {
            conf.analyse = {};
        }
        if(!conf.analyse.conf) {
            conf.analyse.conf = {};
        }
        if(!conf.analyse.conf.loginUrl) {
            conf.analyse.conf.loginUrl = '/auth';
        }
        if(!conf.analyse.conf.registerUrl) {
            conf.analyse.conf.registerUrl = 'https://omatili.maanmittauslaitos.fi/?lang=' + lang;
        }

        if(!conf.publisher2) {
            conf.publisher2 = {};
        }
        if(!conf.publisher2.conf) {
            conf.publisher2.conf = {};
        }
        if(!conf.publisher2.conf.loginUrl) {
            conf.publisher2.conf.loginUrl = '/auth';
        }
        if(!conf.publisher2.conf.registerUrl) {
            conf.publisher2.conf.registerUrl = 'https://omatili.maanmittauslaitos.fi/?lang=' + lang;
        }
    }
});