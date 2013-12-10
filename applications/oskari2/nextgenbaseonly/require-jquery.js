
var lang = 'fi';
require.config({

    /* the base is set to requirejs lib to help requiring 3rd party libs */
    "baseUrl" : "../../../libraries/requirejs/lib",

    /* some path shortcuts to ease declarations */
    paths : {
        _libraries_ : '../../../libraries',    	
        _bundles_ : '../../../bundles',
        _applications_ : '../../../applications',
        _resources_ : '../../../resources'
    },
    config : {
        i18n : {
            locale : lang /* require i18n locale */
        }
    }

});

/* using provided jquery in this demo */
define("jquery", [], function() {
    return jQuery;
});

/* loading base requirements */
require(["jquery", "oskari", "domReady!"],
  function($, Oskari) {
    require(["json!_applications_/oskari2/nextgenbaseonly/config.json", 
    	"_bundles_/oskari/bundle/map-openlayers/bundle"], 
    	function(appConfig) {

        Oskari.setLang(lang); /* oskari locale */
        Oskari.setConfiguration(appConfig);

        require(["_bundles_/oskari/bundle/mapfull-openlayers/bundle", 
        	"_bundles_/framework/bundle/divmanazer/bundle"], 
        	function(mapfull, divmanazer) {

            mapfull.start();
            divmanazer.start();

        });
    })
});
