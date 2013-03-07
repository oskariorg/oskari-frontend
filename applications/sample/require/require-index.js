/**
 *
 */
require.config({
    "baseUrl" : "../../../libraries/requirejs/lib",
    //urlArgs : "bust=" + (new Date()).getTime(),
    config : {
        "oskari" : {
            "compatibility" : true
        }
    },
    paths : {
        _applications_ : '../../../applications',
        _packages_ : '../../../packages'
    }
});

/*
 *
 */
require(["jquery", "oskari", "domReady!"], function($, oskari) {

    require([
        "json!_applications_/sample/require/appsetup.json", 
        "json!_applications_/sample/require/config.json", 
        "css!_applications_/sample/require/style.css"], function(appSetup, appConfig, doc) {

        var app = Oskari.app;
        Oskari.setLang('fi');
        app.setApplicationSetup(appSetup);
        app.setConfiguration(appConfig);
        app.startApplication(function(startupInfos) {

            require(["bundle!_packages_/framework/bundle/coordinatedisplay#cdinstance"], function(bi) {
                console.log("BUNDLEINSTANCE",bi);
            });
        });
    })
});
