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

            var config = "json!applications/oskari2/ol3/minifierAppSetup.json";
            if (window.ajaxUrl) {
                // populate url with possible control parameters
                var getAppSetupParams = "";
                if (typeof window.controlParams == 'object') {
                    for (var key in controlParams) {
                        // FIXME: URLENCODE!!!
                        getAppSetupParams += "&" + key + "=" + controlParams[key];
                    }
                }

                config = "json!" + window.ajaxUrl + "action_route=GetAppSetup" + getAppSetupParams;
            }

            /* loading configuration */
            require([config], function(appSetup) {

                Oskari.setLang(language);

                Oskari.Application
                    .create()
                    .setStartupSequence(appSetup.startupSequence)
                    .setConfiguration(appSetup.configuration)
                    .start()
                    .success(function() {
                        var sb = Oskari.getSandbox();
                        gfiParamHandler(sb);
                    });
            });
        });
});