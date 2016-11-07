/**
 * @class Oskari.tampere.bundle.searchfromchannels.SearchFromChannelsBundle
 * 
 */
Oskari.clazz.define("Oskari.tampere.bundle.searchfromchannels.SearchFromChannelsBundle", function() {

}, {
	"create" : function() {

		return Oskari.clazz.create("Oskari.tampere.bundle.searchfromchannels.SearchFromChannelsBundleInstance");

	},
	"start" : function() {
	},
	"stop" : function() {
	},
	"update" : function(manager, bundle, bi, info) {

	}
}, {

	"protocol" : ["Oskari.bundle.Bundle", "Oskari.bundle.BundleInstance", "Oskari.mapframework.bundle.extension.ExtensionBundle"],
	"source" : {

		"scripts" : [
			/* service */
			{
	            "type": "text/javascript",
	            "src": "../../../../bundles/tampere/search-from-channels/service/WfsSearchService.js"
	        },
			{
	            "type": "text/javascript",
	            "src": "../../../../bundles/tampere/search-from-channels/service/ChannelOptionService.js"
	        },
	        /* instance */
	        {
				"type" : "text/javascript",
				"src" : "../../../../bundles/tampere/search-from-channels/instance.js"
			},
	        /* css */
			{
				"type" : "text/css",
				"src" : "../../../../bundles/tampere/search-from-channels/resources/css/style.css"
			}
		], 
		"locales" : [  
		{
			"lang" : "fi",
			"type" : "text/javascript",
			"src" : "../../../../bundles/tampere/search-from-channels/resources/locale/fi.js"
		},{
			"lang" : "en",
			"type" : "text/javascript",
			"src" : "../../../../bundles/tampere/search-from-channels/resources/locale/en.js"
		},{
			"lang" : "sv",
			"type" : "text/javascript",
			"src" : "../../../../bundles/tampere/search-from-channels/resources/locale/sv.js"
		}],
		"resources" : []
	},
	"bundle" : {
		"manifest" : {
			"Bundle-Identifier" : "search-from-channels",
			"Bundle-Name" : "search-from-channels",
			"Bundle-Author" : [{
				"Name" : "Dimenteq Oy",
				"Organisation" : "Dimenteq Oy",
				"Temporal" : {
					"Start" : "2015",
					"End" : "2015"
				},
				"Copyleft" : {
					"License" : {
						"License-Name" : "EUPL",
						"License-Online-Resource" : "http://www.paikkatietoikkuna.fi/license"
					}
				}
			}],			
			"Bundle-Version" : "1.0.0",
			"Import-Namespace" : ["Oskari"],
			"Import-Bundle" : {}
		}
	}
});

Oskari.bundle_manager.installBundleClass("search-from-channels", "Oskari.tampere.bundle.searchfromchannels.SearchFromChannelsBundle");
