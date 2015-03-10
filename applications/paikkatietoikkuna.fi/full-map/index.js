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

    if (!language) {
        // default to finnish
        language = 'fi';
    }
    Oskari.setLang(language);
    Oskari.setLoaderMode('dev');
    Oskari.setPreloaded(preloaded);

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

    function start(appSetup, appConfig, cb) {
        var app = Oskari.app;

        /*add metadatafeedback bundle. TODO: Add this to db*/
        var metadatafeedback = {
            "title" : "metadatafeedback",
            "fi" : "metadatafeedback",
            "sv" : "metadatafeedback",
            "en" : "metadatafeedback",
            "bundlename" : "metadatafeedback",
            "bundleinstancename" : "metadatafeedback",
            "metadata" : {
                "Import-Bundle" : {
                    "metadatafeedback" : {
                        "bundlePath" : "/Oskari/packages/catalogue/bundle/"
                    }
                },
                "Require-Bundle-Instance" : []
            },
            "instanceProps" : {}
        }
        appSetup.startupSequence.push(metadatafeedback);






        app.setApplicationSetup(appSetup);
        app.setConfiguration(appConfig);
        app.startApplication(function (startupInfos) {
            var instance = startupInfos.bundlesInstanceInfos.mapfull.bundleInstance;
            if (cb) {
                cb(instance);
            }
        });

    }


    jQuery.ajax({
        type: 'POST',
        dataType: 'json',
        beforeSend: function (x) {
            if (x && x.overrideMimeType) {
                x.overrideMimeType("application/j-son;charset=UTF-8");
            }
        },
        data : getAppSetupParams,
        url: ajaxUrl + 'action_route=GetAppSetup',
        success: function (app) {
            if (app.startupSequence && app.configuration) {
                var appSetup = {
                    "startupSequence": app.startupSequence
                };
                start(appSetup, app.configuration, function (instance) {
                    var sb = instance.getSandbox();
                    gfiParamHandler(sb);
                });
            } else {
                jQuery('#mapdiv').append('Unable to start');
            }
        },
        error: function (jqXHR, textStatus) {
            if (jqXHR.status !== 0) {
                jQuery('#mapdiv').append('Unable to start');
            }
        }
    });
});