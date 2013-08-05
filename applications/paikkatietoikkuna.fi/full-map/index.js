/**
 * Start when dom ready
 */
jQuery(document).ready(function() {
    if (!ajaxUrl) {
        alert('Ajax URL not set - cannot proceed');
        return;
    }

    function getURLParameter(name) {
        var re = name + '=' + '([^&]*)(&|$)';
        var value = RegExp(re).exec(location.search);
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

    if (!language) {
        // default to finnish
        language = 'fi';
    }
    Oskari.setLang(language);

    Oskari.setLoaderMode('dev');
    Oskari.setPreloaded(preloaded);

    function gfiParamHandler(sandbox) {
        if (getURLParameter('showGetFeatureInfo') != 'true') {
            return;
        }
        var lon = sandbox.getMap().getX();
        var lat = sandbox.getMap().getY();
        var mapModule = sandbox.findRegisteredModuleInstance('MainMapModule');
        var px = mapModule.getMap().getViewPortPxFromLonLat({
            lon: lon,
            lat: lat
        });
        sandbox.postRequestByName('MapModulePlugin.GetFeatureInfoRequest', [lon, lat, px.x, px.y]);
    }

    function start(appSetup, appConfig, cb) {
        var app = Oskari.app;

        // Analyse bundle
        /*
        appConfig.mapfull.conf.plugins.push({
            "id" : "Oskari.mapframework.bundle.mapanalysis.plugin.AnalysisLayerPlugin"
        });
        appSetup.startupSequence[1].metadata["Import-Bundle"]["mapanalysis"] = {
            bundlePath : '/Oskari/packages/framework/bundle/'
        };
*/
        app.setApplicationSetup(appSetup);
        app.setConfiguration(appConfig);
        app.startApplication(function(startupInfos) {
            var instance = startupInfos.bundlesInstanceInfos.mapfull.bundleInstance;
            if (cb) {
                cb(instance);
            }
            /*
             var ugStartup = {
                title : 'Analyse',
                fi : 'Analyysi',
                sv : 'Analys',
                en : 'Analyse',
                bundlename : 'analyse',
                bundleinstancename : 'analyse',
                metadata : {
                    "Import-Bundle" : {
                        "analyse" : {
                            bundlePath : '/Oskari/packages/analysis/bundle/'
                        }
                    },
                    "Require-Bundle-Instance" : []
                },
                instanceProps : {}
            };

            Oskari.bundle_facade.playBundle(ugStartup, function() {
            });
*/
        });

    }


    jQuery.ajax({
        type: 'POST',
        dataType: 'json',
        beforeSend: function(x) {
            if (x && x.overrideMimeType) {
                x.overrideMimeType("application/j-son;charset=UTF-8");
            }
        },
        data : getAppSetupParams,
        url: ajaxUrl + 'viewId=' +viewId +'&action_route=GetAppSetup',
        success: function(app) {
            if (app.startupSequence && app.configuration) {
              var appSetup = {
                "startupSequence": app.startupSequence
              };
              start(appSetup, app.configuration, function(instance) {
                    var sb = instance.getSandbox();
                    gfiParamHandler(sb);
                });
            } else {
                jQuery('#mapdiv').append('Unable to start');
            }
        },
        error: function(jqXHR, textStatus) {
            if (jqXHR.status != 0) {
                jQuery('#mapdiv').append('Unable to start');
            }
        }
    });
});