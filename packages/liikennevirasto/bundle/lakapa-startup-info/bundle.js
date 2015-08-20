/**
* @class Oskari.liikennevirasto.bundle.lakapa.StartupInfoBundle
* 
*/
Oskari.clazz.define("Oskari.liikennevirasto.bundle.lakapa.StartupInfoBundle", function() {
	
}, {
	"create" : function() {
		return Oskari.clazz.create("Oskari.liikennevirasto.bundle.lakapa.StartupInfoBundleInstance");
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
                "type": "text/javascript",
                "src": "../../../../libraries/jquery/plugins/jquery.cookie.js"
            },
			{
				"type" : "text/javascript",
				"src" : "../../../../bundles/liikennevirasto/lakapa-startup-info/instance.js"
			},
			{
				"type" : "text/css",
				"src" : "../../../../bundles/liikennevirasto/bundle/lakapa-startup-info/resources/css/style.css"
			}, 
			{
				"language" : "fi",
				"type" : "text/javascript",
				"src" : "../../../../bundles/liikennevirasto/lakapa-startup-info/resources/locale/fi.js"
			},{
				"language" : "en",
				"type" : "text/javascript",
				"src" : "../../../../bundles/liikennevirasto/lakapa-startup-info/resources/locale/en.js"
			},{
				"language" : "sv",
				"type" : "text/javascript",
				"src" : "../../../../bundles/liikennevirasto/lakapa-startup-info/resources/locale/sv.js"
			}],
		"resources" : []
	},
	"bundle" : {
		"manifest" : {
			"Bundle-Identifier" : "lakapa-startup-info",
			"Bundle-Name" : "lakapa-startup-info",
			"Bundle-Author" : [{
				"Name" : "Heikki Ylitalo",
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

Oskari.bundle_manager.installBundleClass("lakapa-startup-info", "Oskari.liikennevirasto.bundle.lakapa.StartupInfoBundle");