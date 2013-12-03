require(["mainConfig"], function() {

    /* loading base requirements */
    require(["jquery", "oskari-with-app", "domReady"],
    /**
     * ... now we have jQuery and Oskari
     */
    function(jQuery, Oskari) {

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

        var config = "json!applications/oskari2/full-map_guest/minifierAppSetup.json";
        if (window.ajaxUrl) {
            // populate url with possible control parameters
            var getAppSetupParams = "";
            if(typeof window.controlParams == 'object') {
                for(var key in controlParams) {
                    getAppSetupParams += "&" + key + "=" + controlParams[key];
                }
            }

            //config = "json!/web/fi/kartta?p_p_id=Portti2Map_WAR_portti2mapportlet&p_p_lifecycle=2&&action_route=GetAppSetup" + getAppSetupParams;
        }

        /* loading configuration */
        require([config, 
            "map"], function(appSetup) {
            Oskari.setLang(language);
            var appConfig = appSetup.configuration;
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
            require(["mapfull",
                "mapmodule-plugin",
                "divmanazer"], function(mapfull, mapmodule, divmanazer) {

                /* starting to show user that something or another is happening */
                mapfull.start();
                divmanazer.start();

                var bundles = [];

                for (bundle in appConfig) {
                    if ((bundle === "mapfull") || (bundle === "divmanazer") || (bundle === "openlayers-default-theme")) {
                        // already loaded
                    } else if (bundle === "statsgrid") {
                        bundles.push("bundles/statistics/bundle/" + bundle + "/module");
                    } else if (bundle === "metadataflyout") {
                        bundles.push("bundles/catalogue/bundle/" + bundle + "/module");
                    } else if (bundle === "guidedtour") {
                        console.log('relocating guidedtour')
                        bundles.push("src/framework/" + bundle + "/module");
                    } else {
                        bundles.push("bundles/framework/bundle/" + bundle + "/module");
                    }
                }

//                console.log('bundles', bundles);

                require(bundles, function () {

/*                require([
                    "bundles/framework/bundle/backendstatus/module",
                    "bundles/framework/bundle/guidedtour/module",
                    "bundles/framework/bundle/toolbar/module",
                    "bundles/framework/bundle/layerselection2/module",
                    "bundles/framework/bundle/userguide/module",
                    "bundles/framework/bundle/layerselector2/module",
                    "bundles/framework/bundle/personaldata/module",
                    "bundles/framework/bundle/publisher/module",
                    "bundles/framework/bundle/printout/module",
                    "bundles/framework/bundle/search/module",
                    "bundles/framework/bundle/maplegend/module",
                    "bundles/framework/bundle/featuredata/module",
                    "bundles/framework/bundle/divmanazer/module",
                    "bundles/framework/bundle/statehandler/module",
                    "bundles/framework/bundle/infobox/module",
                    "bundles/framework/bundle/coordinatedisplay/module",
                    "bundles/framework/bundle/promote/module"], function () {*/
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