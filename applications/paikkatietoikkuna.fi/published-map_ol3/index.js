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
    if(ssl) {
        ajaxUrl += "ssl=" + ssl + "&";
    }
    var getAppSetupParams = {};
    if(typeof window.controlParams == 'object') {
        for(var key in controlParams) {
            getAppSetupParams[key] = controlParams[key];
        }
    }
        
    if(!language) {
        // default to finnish
        language = 'fi';
    }
    Oskari.setLang(language);

    Oskari.setLoaderMode('dev');

    function gfiParamHandler(sandbox) {
        if(getURLParameter('showGetFeatureInfo') != 'true') {
            return;
        }
        var lon  = sandbox.getMap().getX();
        var lat  = sandbox.getMap().getY();
        var mapModule = sandbox.findRegisteredModuleInstance('MainMapModule');
        var px = mapModule.getMap().getViewPortPxFromLonLat({lon : lon, lat: lat});
        sandbox.postRequestByName('MapModulePlugin.GetFeatureInfoRequest', [lon, lat, px.x, px.y]);
    }

    function start(appSetup, appConfig, cb) {
        var app = Oskari.app;
    
    /*
    var plugins = appConfig.mapfull.conf.plugins,
        wfs;
    for (var i = 0, pLen = plugins.length; i < pLen; ++i) {
        if (plugins[i].id === 'Oskari.mapframework.bundle.mapwfs2.plugin.WfsLayerPlugin') {
            wfs = plugins[i];
            break;
        }
    }
    if (wfs) {
        wfs.config = {
            "maxBackoff": 60000,
            "port": "80",
            "maxNetworkDelay": 10000,
            "hostname": "dev.paikkatietoikkuna.fi",
            "contextPath": "/transport-0.0.1",
            "lazy": true,
            "backoffIncrement": 1000,
            "disconnectTime": 30000
        };
    }
*/    
        app.setApplicationSetup(appSetup);
        app.setConfiguration(appConfig);
        app.startApplication(function(startupInfos) {
          if (cb) {
              cb();
          }
/*
             var ugStartup = {
                "title" : "Publishedmyplaces2",
                "fi" : "publishedmyplaces2",
                "sv" : "publishedmyplaces2",
                "en" : "publishedmyplaces2",
                "bundlename" : "publishedmyplaces2",
                "bundleinstancename" : "publishedmyplaces2",
                "metadata" : {
                    "Import-Bundle" : {
                        "publishedmyplaces2" : {
                            "bundlePath" : "/Oskari/packages/framework/bundle/"
                        }
                    },
                    "Require-Bundle-Instance" : []
                },
                "instanceProps" : {}
            };

            Oskari.bundle_facade.playBundle(ugStartup, function() {
            });
*/
/*

             var ugStartup = {
                title : 'publishedstatehandler',
                fi : 'publishedstatehandler',
                sv : 'publishedstatehandler',
                en : 'publishedstatehandler',
                bundlename : 'publishedstatehandler',
                bundleinstancename : 'publishedstatehandler',
                metadata : {
                    "Import-Bundle" : {
                        "publishedstatehandler" : {
                            bundlePath : '/Oskari/packages/framework/bundle/'
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
        type : 'GET',
        dataType : 'json',
        data : getAppSetupParams,
        url : ajaxUrl + 'action_route=GetAppSetup&noSavedState=true',
        success : function(app) {
            if (app.startupSequence && app.configuration) {
              var appSetup = {
                "startupSequence": app.startupSequence
              };
              start(appSetup, app.configuration, function() {
                    var sb = Oskari.getSandbox();
                    gfiParamHandler(sb);
                });
            } else {
                jQuery('#mapdiv').append('Unable to start');
            }
        },
        error : function(jqXHR, textStatus) {
            if (jqXHR.status != 0) {
                jQuery('#mapdiv').append('Unable to start');
            }
        }
    });
}); 