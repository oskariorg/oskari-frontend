/*
* require/require.html
* require/require-index.js
* ...
*
* PoC: requirejs.org based startup for Oskari map application with support for bundles
* loading additional modules with requirejs.
*
* Enabling require to be used with Oskari will make it easier to migrate 3rd party modules to
* oskari.
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
 * config:
 *
 * we must fix some requirejs path shortcuts to
 *  cope with Oskari directory structure.
 *
 *
 *
 */
require.config({

    /* the base is set to requirejs lib to help requiring 3rd party libs */
    "baseUrl" : "../../../libraries/requirejs/lib",

    /* some path shortcuts to ease declarations */
    paths : {
        _libraries_ : '../../../libraries',
        _applications_ : '../../../applications',
        _packages_ : '../../../packages'
    }

});

/*
 * start: as an example we will load in stages
 *
 * 1) base functionality with requirejs only
 * 2) application setup with requirejs json plugin
 * 3) (modified) Oskari loader is used load the app based on appSetup JSON
 * 4) a sample additional bundle instance is loaded and instantiated with alternate less verbose require based syntax
 *
 */

/* 1) base functionality with requirejs only */

require(["jquery", "oskari", "domReady!"],

/**
 * ... now we have jQuery and Oskari
 */
function($, oskari) {

    /* 2) application setup with requirejs json plugin */
    require({
        urlArgs : "bust=" + (new Date()).getTime() /* bust Cache for dev */
    }, ["json!_applications_/sample/require/appsetup.json", 
        "json!_applications_/sample/require/config.json", 
        "css!_applications_/sample/require/style.css", 
        "css!_applications_/sample/require/icons.css", 
        "css!_applications_/sample/require/layout-grid.css"
    ],
    /* ... now we have appSetup, appConfig and DOM */
    function(appSetup, appConfig, doc) {

        /* 3) (requirejsified) Oskari loader is used load the app based on appSetup JSON */
        var app = Oskari.app;
        Oskari.setLang('fi');
        app.setApplicationSetup(appSetup);
        app.setConfiguration(appConfig);
        app.startApplication(function(startupInfos) {

            /* 4) a sample additional bundle instance is loaded and instantiated with alternate less verbose require based syntax */
            require({
                urlArgs : undefined
            }, ["bundle!_packages_/framework/bundle/coordinatedisplay#cdinstance"], 
                function(bi) {
                    /* now we have the bundle instance */
                    console.log("BUNDLEINSTANCE", bi);
            });
        });
    })
});
