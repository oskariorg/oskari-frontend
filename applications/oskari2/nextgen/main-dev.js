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
    	"_bundles_/oskari/bundle/map-openlayers/module"], function(appConfig) {
        Oskari.setLang(language);
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
        require(["_bundles_/oskari/bundle/mapfull-openlayers/module", 
        	"_bundles_/framework/bundle/divmanazer/module"], function(mapfull, divmanazer) {

                console.log('here sagfdhgsfhd');

            /* starting to show user that something or another is happening */
            mapfull.start();
            divmanazer.start();

            console.log('mapfull and divmanazer started');

            require([
                "_bundles_/require/bundle/require/module",
                "_bundles_/require/bundle/requiresf/module",
                "_bundles_/require/bundle/requireminimal/module",
                "_bundles_/require/bundle/requirenr/module",
                "_bundles_/require/bundle/requireminloc/module",
                "_bundles_/require/bundle/requirenop/module",
                "_bundles_/require/bundle/requirei18n/module",
                "_bundles_/framework/bundle/toolbar/module",
                "_bundles_/framework/bundle/promote/module"
                ], function () {
                    for(var i = 0, ilen = arguments.length; i < ilen; i++) {
                        arguments[i].start();
                    }
                }
            );
        });
    })
});
