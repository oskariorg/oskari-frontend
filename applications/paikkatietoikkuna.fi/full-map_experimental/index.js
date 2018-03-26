'use strict';
/**
 * Start when dom ready
 */
jQuery(document).ready(function () {
    var getAppSetupParams = {};
    // populate url with possible control parameters
    Object.keys(window.controlParams || {}).forEach(function (key) {
        getAppSetupParams[key] = window.controlParams[key];
    });

    function gfiParamHandler (sandbox) {
        if (Oskari.util.getRequestParam('showGetFeatureInfo', false) !== 'true') {
            return;
        }
        // getPixelFromCoordinate should be part of mapmodule instead of doing ol3-specific code here
        // for some reason a timeout is required, but this is a hacky feature anyway
        // TODO: refactor to be more useful.GetFeatureInfoRequest shouldn't take both coordinates and pixels but one or the other
        // otherwise we should check if the pixels and coordinates do actually match
        setTimeout(function () {
            var lon = sandbox.getMap().getX();
            var lat = sandbox.getMap().getY();
            var mapModule = sandbox.findRegisteredModuleInstance('MainMapModule');
            var px = mapModule.getMap().getPixelFromCoordinate([lon, lat]);
            if (px) {
                sandbox.postRequestByName('MapModulePlugin.GetFeatureInfoRequest', [lon, lat, px[0], px[1]]);
            }
        }, 500);
    }

    jQuery.ajax({
        type: 'POST',
        dataType: 'json',
        data: getAppSetupParams,
        url: '/action?action_route=GetAppSetup',
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
    function terribleHackToBeRemoved (conf, lang) {
        if (!conf.personaldata) {
            conf.personaldata = {};
        }
        if (!conf.personaldata.conf) {
            conf.personaldata.conf = {};
        }
        if (!conf.personaldata.conf.logInUrl) {
            conf.personaldata.conf.logInUrl = '/auth';
            // personal data doesn't support registration link
        }

        if (!conf.analyse) {
            conf.analyse = {};
        }
        if (!conf.analyse.conf) {
            conf.analyse.conf = {};
        }
        if (!conf.analyse.conf.loginUrl) {
            conf.analyse.conf.loginUrl = '/auth';
        }
        if (!conf.analyse.conf.registerUrl) {
            conf.analyse.conf.registerUrl = 'https://omatili.maanmittauslaitos.fi/?lang=' + lang;
        }

        if (!conf.publisher2) {
            conf.publisher2 = {};
        }
        if (!conf.publisher2.conf) {
            conf.publisher2.conf = {};
        }
        if (!conf.publisher2.conf.loginUrl) {
            conf.publisher2.conf.loginUrl = '/auth';
        }
        if (!conf.publisher2.conf.registerUrl) {
            conf.publisher2.conf.registerUrl = 'https://omatili.maanmittauslaitos.fi/?lang=' + lang;
        }
    }
});
