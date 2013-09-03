require.config({

    /* the base is set to requirejs lib to help requiring 3rd party libs */
    "baseUrl" : "/Oskari/libraries/requirejs/lib",

    /* some path shortcuts to ease declarations */
    paths : {
        _libraries_ : '/Oskari/libraries',    	
        _bundles_ : '/Oskari/bundles',
        _applications_ : '/Oskari/applications',
        _resources_ : '/Oskari/resources',
        jquery: "http://code.jquery.com/jquery-1.9.1",
        "jquery-migrate": "/Oskari/libraries/jquery/jquery-migrate-1.2.1-modified"
    },
    // Add this map config in addition to any baseUrl or
    // paths config you may already have in the project.
    map: {
      // '*' means all modules will get 'jquery-private'
      // for their 'jquery' dependency.
      '*': { 'jquery': 'jquery-migrate' },

      // 'jquery-private' wants the real jQuery module
      // though. If this line was not here, there would
      // be an unresolvable cyclic dependency.
      'jquery-migrate': { 'jquery': 'jquery' }
    },
    config : {
        i18n : {
            locale : language
        }
    }
});


/* loading base requirements */
require(["jquery", "oskari", /*"oskariloader",*/"domReady!"],
/**
 * ... now we have jQuery and Oskari
 */
function($, Oskari) {
    var config = "json!_applications_/oskari2/nextgen/config.json";

    /* loading configuration */
    require([config, 
    	"_bundles_/oskari/bundle/map-openlayers/bundle"], function(appConfig) {
        Oskari.setLang(language);
        Oskari.setConfiguration(appConfig);

        /* loading main map and divmanazer */
        require(["_bundles_/oskari/bundle/mapfull-openlayers/bundle", 
        	"_bundles_/framework/bundle/divmanazer/bundle"], function(mapfull, divmanazer) {

            /* starting to show user that something or another is happening */
            mapfull.start();
            divmanazer.start();

            /* loading more bundles */
            require(["_bundles_/require/bundle/require/bundle", 
            "_bundles_/require/bundle/requiresf/bundle", 
            "_bundles_/require/bundle/requireminimal/bundle", 
            "_bundles_/require/bundle/requirenr/bundle", 
            "_bundles_/require/bundle/requireminloc/bundle", 
            "_bundles_/require/bundle/requirenop/bundle", 
            "_bundles_/require/bundle/requirei18n/bundle"], 
            function(rclassic, rsinglefile, rminimal, rnorules, rminlinesofcode, rnop, ri18n) {

                /* and starting */
                rclassic.start();
                rsinglefile.start();
                rminimal.start();
                rnorules.start();
                rminlinesofcode.start();
                rnop.start();
                ri18n.start();

            })
        });
    })
});
