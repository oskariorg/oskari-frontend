/**
* @class Oskari.liikennevirasto.bundle.lakapa.LaKaPaSupportedBrowserBundle
* 
*/
Oskari.clazz.define("Oskari.liikennevirasto.bundle.lakapa.LaKaPaSupportedBrowserBundle", function() {
	
}, {
	"create" : function() {
		return Oskari.clazz.create("Oskari.liikennevirasto.bundle.lakapa.LaKaPaSupportedBrowserBundleInstance");
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
				"src" : "../../../../bundles/liikennevirasto/lakapa-supported-browser/instance.js"
			},
			{
				"type" : "text/css",
				"src" : "../../../../bundles/liikennevirasto/bundle/lakapa-supported-browser/resources/css/style.css"
			}, 
			{
				"language" : "fi",
				"type" : "text/javascript",
				"src" : "../../../../bundles/liikennevirasto/lakapa-supported-browser/resources/locale/fi.js"
			},{
				"language" : "en",
				"type" : "text/javascript",
				"src" : "../../../../bundles/liikennevirasto/lakapa-supported-browser/resources/locale/en.js"
			},{
				"language" : "sv",
				"type" : "text/javascript",
				"src" : "../../../../bundles/liikennevirasto/lakapa-supported-browser/resources/locale/sv.js"
			}],
		"resources" : []
	},
	"bundle" : {
		"manifest" : {
			"Bundle-Identifier" : "lakapa-supported-browser",
			"Bundle-Name" : "lakapa-supported-browser",
			"Bundle-Author" : [{
				"Name" : "Heikki Ylitalo",
				"Organisation" : "Dimenteq Oy",
				"Temporal" : {
					"Start" : "2014",
					"End" : "2014"
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

Oskari.bundle_manager.installBundleClass("lakapa-supported-browser", "Oskari.liikennevirasto.bundle.lakapa.LaKaPaSupportedBrowserBundle");