/*
 * require/require.html
 * require/require-index.js
 * ...
 * 
 * PoC: requirejs.org based startup for Oskari map application with support for modules
 * loading additional modules with requirejs.
 *
 * Features:
 * - oskari: Implemented a modified Oskari loader that uses require to load any dependencies
 * - oskari: Implemented support to declaring require dependencies in bundle.js
 * - oskari: Implemented requirejs plugin to load and instantiate bundle with require declarations 
  *
 * Dependencies:
 * - requirejs: require-jquery WITH added jQuery migration file to not modify code for this demo 
 * - requirejs: json plugin used to load appsetup and config json definitions
 * - requirejs: css plugin used to load CSS resources
 *
 * To-DO: 
  * - evaluate  
 *  
 */
/**
 * we must fix some requirejs path shortcuts to 
 *  cope with Oskari directory structure.
 * 
 * 
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

            /* alternate syntax to launch a bundle */
            /* <bundle-js-path>#<bundlinstancename> */
            
            require(["bundle!_packages_/framework/bundle/coordinatedisplay#cdinstance"], function(bi) {
                console.log("BUNDLEINSTANCE",bi);
            });
        });
    })
});
