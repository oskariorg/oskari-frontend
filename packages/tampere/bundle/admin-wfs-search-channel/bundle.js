/**
* @class Oskari.tampere.bundle.tampere.AdminWfsSearchChannelBundle
* 
*/
Oskari.clazz.define("Oskari.tampere.bundle.tampere.AdminWfsSearchChannelBundle", function() {
	
}, {
	"create" : function() {
		return Oskari.clazz.create("Oskari.tampere.bundle.tampere.AdminWfsSearchChannelBundleInstance");
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
			{
				"type" : "text/javascript",
				"src" : "../../../../bundles/tampere/admin-wfs-search-channel/instance.js"
			},
			{
				"type" : "text/javascript",
				"src" : "../../../../bundles/tampere/admin-wfs-search-channel/Flyout.js"
			},
			{
				"type" : "text/javascript",
				"src" : "../../../../bundles/tampere/admin-wfs-search-channel/Channels.js"
			},
			{
				"type" : "text/javascript",
				"src" : "../../../../bundles/tampere/admin-wfs-search-channel/Tile.js"
			},
			{
				"type" : "text/css",
				"src" : "../../../../bundles/tampere/admin-wfs-search-channel/resources/css/style.css"
			}, 
			{
	            "src" : "../../../../libraries/chosen/1.5.1/chosen.jquery.js",
	            "type" : "text/javascript"
       		},
       		{
	            "src" : "../../../../libraries/chosen/1.5.1/chosen.css",
	            "type" : "text/css"
        	}],

        	"locales": [{
				"lang" : "fi",
				"type" : "text/javascript",
				"src" : "../../../../bundles/tampere/admin-wfs-search-channel/resources/locale/fi.js"
			},{
				"lang" : "en",
				"type" : "text/javascript",
				"src" : "../../../../bundles/tampere/admin-wfs-search-channel/resources/locale/en.js"
			},{
				"lang" : "sv",
				"type" : "text/javascript",
				"src" : "../../../../bundles/tampere/admin-wfs-search-channel/resources/locale/sv.js"
			}]
	},
	"bundle" : {
		"manifest" : {
			"Bundle-Identifier" : "admin-wfs-search-channel",
			"Bundle-Name" : "admin-wfs-search-channel",
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

Oskari.bundle_manager.installBundleClass("admin-wfs-search-channel", "Oskari.tampere.bundle.tampere.AdminWfsSearchChannelBundle");