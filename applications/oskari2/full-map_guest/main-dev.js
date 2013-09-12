require(["mainConfig"], function() {

    /* loading base requirements */
    require(["jquery", "oskari","domReady"],
    /**
     * ... now we have jQuery and Oskari
     */
    function($, Oskari) {

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

        var config = "json!_applications_/oskari2/full-map_guest/minifierAppSetup.json";
        if (window.ajaxUrl) {
            // populate url with possible control parameters
            var getAppSetupParams = "";
            if(typeof window.controlParams == 'object') {
                for(var key in controlParams) {
                    getAppSetupParams += "&" + key + "=" + controlParams[key];
                }
            }

            config = "json!/web/fi/kartta?p_p_id=Portti2Map_WAR_portti2mapportlet&p_p_lifecycle=2&&action_route=GetAppSetup" + getAppSetupParams;
        }

        /* loading configuration */
        require([config, 
            "_bundles_/oskari/bundle/map-openlayers/module"], function(appSetup) {
            Oskari.setLang(language);
            var appConfig = appSetup.configuration;
            console.log('config', appConfig);
            appConfig.promote = {
                    "conf": {
                        "__name": "Promote",
                        "title": {
                            "fi": "Otsikko tileen",
                            "en": "Title for Tile"
                        },
                        "desc": {
                            "fi": "Voit käyttää julkaisutoimintoa kirjauduttuasi palveluun.",
                            "en": "You need to log in before using the embedding function."
                        },
                        "signup": {
                            "fi": "Kirjaudu sisään",
                            "en": "Log in"
                        },
                        "signupUrl": {
                            "fi": "/web/fi/login",
                            "en": "/web/en/login"
                        },
                        "register": {
                            "fi": "Rekisteröidy",
                            "en": "Register"
                        },
                        "registerUrl": {
                            "fi": "/web/fi/login?p_p_id=58&p_p_lifecycle=1&p_p_state=maximized&p_p_mode=view&p_p_col_id=column-1&p_p_col_count=1&saveLastPath=0&_58_struts_action=%2Flogin%2Fcreate_account",
                            "en": "/web/en/login?p_p_id=58&p_p_lifecycle=1&p_p_state=maximized&p_p_mode=view&p_p_col_id=column-1&p_p_col_count=1&saveLastPath=0&_58_struts_action=%2Flogin%2Fcreate_account"
                        },
                        "test_toolbarButtons": {
                            "buttonGrp": {
                                "buttonId": {
                                    "iconCls": "tool-reset",
                                    "tooltip": {
                                        "fi": "jee",
                                        "en": "jee en"
                                    }
                                }
                            }
                        }
                    }
                };

            Oskari.setConfiguration(appConfig);

            /* loading main map and divmanazer */
            require(["_bundles_/framework/bundle/mapfull/module",
                "_bundles_/framework/bundle/mapmodule-plugin/module",
                "_bundles_/framework/bundle/divmanazer/module"], function(mapfull, mapmodule, divmanazer) {

                console.log('starting mapfull');

                /* starting to show user that something or another is happening */
                mapfull.start();
                console.log('starting divmanazer');
                divmanazer.start();

                console.log('mapfull and divmanazer started', appConfig);

                var bundles = [];

                for (bundle in appConfig) {
                    if ((bundle === "mapfull") || (bundle === "divmanazer") || (bundle === "openlayers-default-theme")) {
                        // already loaded
                    } else if (bundle === "statsgrid") {
                        bundles.push("_bundles_/statistics/bundle/" + bundle + "/module");
                    } else if (bundle === "metadataflyout") {
                        bundles.push("_bundles_/catalogue/bundle/" + bundle + "/module");
                    } else {
                        bundles.push("_bundles_/framework/bundle/" + bundle + "/module");
                    }
                }

                console.log('bundles', bundles);

                require(bundles, function () {

/*                require([
                    "_bundles_/framework/bundle/backendstatus/module",
                    "_bundles_/framework/bundle/guidedtour/module",
                    "_bundles_/framework/bundle/toolbar/module",
                    "_bundles_/framework/bundle/layerselection2/module",
                    "_bundles_/framework/bundle/userguide/module",
                    "_bundles_/framework/bundle/layerselector2/module",
                    "_bundles_/framework/bundle/personaldata/module",
                    "_bundles_/framework/bundle/publisher/module",
                    "_bundles_/framework/bundle/printout/module",
                    "_bundles_/framework/bundle/search/module",
                    "_bundles_/framework/bundle/maplegend/module",
                    "_bundles_/framework/bundle/featuredata/module",
                    "_bundles_/framework/bundle/divmanazer/module",
                    "_bundles_/framework/bundle/statehandler/module",
                    "_bundles_/framework/bundle/infobox/module",
                    "_bundles_/framework/bundle/coordinatedisplay/module",
                    "_bundles_/framework/bundle/promote/module"], function () {*/
                        for(var i = 0, ilen = arguments.length; i < ilen; i++) {
                            arguments[i].start();
                        }
                        console.log('Calling GFI Param Handler');
                        var sb = Oskari.getSandbox();
                        gfiParamHandler(sb);
                    }
                );
            });
        });
    });
});