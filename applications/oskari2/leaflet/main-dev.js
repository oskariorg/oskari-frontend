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

            var config = "json!applications/oskari2/leaflet/minifierAppSetup.json";
            if (window.ajaxUrl) {
                // populate url with possible control parameters
                var getAppSetupParams = "";
                if (typeof window.controlParams == 'object') {
                    for (var key in controlParams) {
                        getAppSetupParams += "&" + key + "=" + controlParams[key];
                    }
                }

                //config = "json!/web/fi/kartta?p_p_id=Portti2Map_WAR_portti2mapportlet&p_p_lifecycle=2&&action_route=GetAppSetup" + getAppSetupParams;
            }

            /* loading configuration */
            require([config], function(appSetup) {

                Oskari.setLang(language);

                window.debugApp = Oskari.Application
                    .create()
                    .setStartupSequence(appSetup.startupSequence)
                    .setConfiguration(appSetup.configuration)
                    .start()
                    .success(function() { console.log("ALL DONE");});

                /* loading main map and divmanazer 
                require(["mapfull",
                    "mapmodule-plugin",
                    "src/framework/bundle/divmanazer/module"
                ], function(mapfull, mapmodule, divmanazer) {


                    /* starting to show user that something or another is happening *
//                    mapfull.start();
                    console.log('starting divmanazer');
//                    divmanazer.start();
                    console.log('divmanazer started');

                    var bundles = [];

                    for (bundle in appConfig) {
                        if ((bundle === "mapfull") || (bundle === "divmanazer") || (bundle === "openlayers-default-theme")) {
                            // already loaded
                        } else if (bundle === "statsgrid") {
                            bundles.push("bundles/statistics/bundle/" + bundle + "/module");
                        } else if (bundle === "metadataflyout") {
                            bundles.push("bundles/catalogue/bundle/" + bundle + "/module");
                        } else if (bundle === "infobox") {
                            bundles.push("src/leaflet/bundle/" + bundle + "/module");
                        } else {
                            bundles.push("bundles/framework/bundle/" + bundle + "/module");
                        }
                    }

                    //                console.log('bundles', bundles);

                    require(bundles, function() {

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
                    "bundles/framework/bundle/promote/module"], function () {*
                        for (var i = 0, ilen = arguments.length; i < ilen; i++) {
//                            arguments[i].start();
                        }
                        console.log('Calling GFI Param Handler');
                        var sb = Oskari.getSandbox();
                        gfiParamHandler(sb);
                    });
                });
*/
            });
        });
});