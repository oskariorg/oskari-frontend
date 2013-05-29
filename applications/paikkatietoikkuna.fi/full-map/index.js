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
    ajaxUrl += getAdditionalParam('zoomLevel');
    ajaxUrl += getAdditionalParam('coord');
    ajaxUrl += getAdditionalParam('mapLayers');
    ajaxUrl += getAdditionalParam('statsgrid');
    ajaxUrl += getAdditionalParam('oldId');
    ajaxUrl += getAdditionalParam('viewId');

    ajaxUrl += getAdditionalParam('isCenterMarker');
    ajaxUrl += getAdditionalParam('address')
    ajaxUrl += getAdditionalParam('showGetFeatureInfo');
    ajaxUrl += getAdditionalParam('nationalCadastralReference');

    ajaxUrl += getAdditionalParam('nationalCadastralReferenceHighlight');
    ajaxUrl += getAdditionalParam('wfsFeature');
    ajaxUrl += getAdditionalParam('wfsHighlightLayer');


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
        var url = "/Oskari/applications/lupapiste/kartta/hub.js";
        jQuery.getScript(url, function() {
            console.log('loaded hub.script');
            hub.subscribe("map-initialized", function(e) {
                jQuery("#eventMessages").html("map-initilized<br/>" + jQuery("#eventMessages").html())
            });
            hub.subscribe("inforequest-map-click", function(e) {
                jQuery("#eventMessages").html("inforequest-map-click (" + e.data.kunta.kuntanimi_fi + " " + e.data.kunta.kuntanumero + "," + e.data.location.x + "," + e.data.location.y + ")<br/>" + jQuery("#eventMessages").html())
            });
        });

        // add html 
        jQuery("body").prepend('<div style="position: absolute;z-index: 1000;"><div id="eventMessages"> </div><div id="formi"><input type="text" id="inputx" value="517620" /><input type="text" id="inputy" value="6874042"/><div><input type="button" id="button1" value="Lisaa markkeri"/><input type="button" id="button2" value="Lisaa markkereita"/><input type="button" id="piirra" value="osoita piste"/>Tyhjenn&auml; ennen lis&auml;yst&auml;: <input type="checkbox" id="checkbox1" /><br/><input type="button" id="tyhjenna" value="poista pisteet"/></div></div></div>');

        //event demot
        jQuery("#button1").click(function() {
            //jQuery("#eventMessages").trigger("center",[parseInt(jQuery("#inputx").val(),10), parseInt(jQuery("#inputy").val(),10)]);
            hub.send("documents-map", {
                clear : jQuery("#checkbox1").is(":checked"),
                data : [{
                    id : new Date().getTime(),
                    location : {
                        x : parseInt(jQuery("#inputx").val(), 10),
                        y : parseInt(jQuery("#inputy").val(), 10)
                    },
                    events : {
                        click : function(e) {
                            jQuery("#eventMessages").html("click<br/>" + jQuery("#eventMessages").html())
                        }
                    }
                }]
            });
            return false;
        });
        jQuery("#button2").click(function() {
            //jQuery("#eventMessages").trigger("center",[parseInt(jQuery("#inputx").val(),10), parseInt(jQuery("#inputy").val(),10)]);
            hub.send("documents-map", {
                clear : jQuery("#checkbox1").is(":checked"),
                data : [{
                    id : "11",
                    location : {
                        x : parseInt(jQuery("#inputx").val(), 10),
                        y : parseInt(jQuery("#inputy").val(), 10)
                    },
                    events : {
                        click : function(e) {
                            jQuery("#eventMessages").html("click11<br/>" + jQuery("#eventMessages").html())
                        }
                    }
                }, {
                    id : "22",
                    location : {
                        x : parseInt(jQuery("#inputx").val(), 10) - 1000 + Math.random() * 2000,
                        y : parseInt(jQuery("#inputy").val(), 10) - 1000 + Math.random() * 2000
                    },
                    events : {
                        click : function(e) {
                            jQuery("#eventMessages").html("click22<br/>" + jQuery("#eventMessages").html())
                        }
                    }
                }, {
                    id : "33",
                    location : {
                        x : parseInt(jQuery("#inputx").val(), 10) - 1000 + Math.random() * 2000,
                        y : parseInt(jQuery("#inputy").val(), 10) - 1000 + Math.random() * 2000
                    },
                    events : {
                        click : function(e) {
                            jQuery("#eventMessages").html("click33<br/>" + jQuery("#eventMessages").html())
                        }
                    }
                }, {
                    id : "44",
                    location : {
                        x : parseInt(jQuery("#inputx").val(), 10) - 1000 + Math.random() * 2000,
                        y : parseInt(jQuery("#inputy").val(), 10) - 1000 + Math.random() * 2000
                    },
                    events : {
                        click : function(e) {
                            jQuery("#eventMessages").html("click44<br/>" + jQuery("#eventMessages").html())
                        }
                    }
                }, {
                    id : "55",
                    location : {
                        x : parseInt(jQuery("#inputx").val(), 10) - 1000 + Math.random() * 2000,
                        y : parseInt(jQuery("#inputy").val(), 10) - 1000 + Math.random() * 2000
                    },
                    events : {
                        click : function(e) {
                            jQuery("#eventMessages").html("click55<br/>" + jQuery("#eventMessages").html())
                        }
                    }
                }]
            });
            return false;
        });
        jQuery("#piirra").click(function() {
            //jQuery("#eventMessages").trigger("piirra");
            hub.send("inforequest-map-start", {
                drawMode : 'point',
                clear : jQuery("#checkbox1").is(":checked")
            });
            return false;
        });
        jQuery("#tyhjenna").click(function() {
            //jQuery("#eventMessages").trigger("tyhjenna");
            hub.send("map-clear-request");
            return false;
        });

        var app = Oskari.app;

        appConfig.lupakartta = {
            "conf": {
                "ajaxurl": "/oskari/integraatio/Kunta.asmx/Hae",
                "printUrl": "/print",
                "zoomMinBbox": 1000
            }
        };

        app.setApplicationSetup(appSetup);
        app.setConfiguration(appConfig);
        app.startApplication(function(startupInfos) {
            var instance = startupInfos.bundlesInstanceInfos.mapfull.bundleInstance;
            if (cb) {
                cb(instance);
            }

            var ugStartup = { 
                "title" : "lupapiste",
                "en" : "lupapiste",
                "fi" : "lupapiste",
                "sv" : "lupapiste",
                "bundleinstancename" : "lupakartta",
                "bundlename" : "lupakartta",
                "instanceProps" : {  },
                "metadata" : { 
                    "Import-Bundle" : { 
                        "lupakartta" : { "bundlePath" : "/Oskari/packages/lupapiste/bundle/" } 
                    },
                    "Require-Bundle-Instance" : [  ]
                }
            };

            Oskari.bundle_facade.playBundle(ugStartup, function() {});
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
        url: ajaxUrl + 'action_route=GetAppSetup',
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