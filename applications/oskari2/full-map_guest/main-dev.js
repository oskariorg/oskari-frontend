require(["mainConfig"], function() {

    /* loading base requirements */
    require(["jquery", "oskari-with-loader","domReady!"],
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
            console.log('we got url!!!', ajaxUrl);

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
        	"_bundles_/oskari/bundle/map-openlayers/bundle",
                "_bundles_/require/bundle/require/bundle", 
                "_bundles_/require/bundle/requiresf/bundle", 
                "_bundles_/require/bundle/requireminimal/bundle", 
                "_bundles_/require/bundle/requirenr/bundle", 
                "_bundles_/require/bundle/requireminloc/bundle", 
                "_bundles_/require/bundle/requirenop/bundle", 
                "_bundles_/require/bundle/requirei18n/bundle"
            ], function(appSetup, bundle, rclassic, rsinglefile, rminimal, rnorules, rminlinesofcode, rnop, ri18n) {
            var app = Oskari.app;
            Oskari.setLang(language);
            app.setApplicationSetup(appSetup);
            console.log(appSetup);
            app.setConfiguration(appSetup.configuration);
            Oskari.setLoaderMode('dev');
            Oskari.setPreloaded(false); // dev

            app.startApplication(function(startupInfos) {
                /* and starting */
                rclassic.start();
                rsinglefile.start();
                rminimal.start();
                rnorules.start();
                rminlinesofcode.start();
                rnop.start();
                ri18n.start();

                var sb = Oskari.getSandbox();
                gfiParamHandler(sb);
            });
        });
    });
});