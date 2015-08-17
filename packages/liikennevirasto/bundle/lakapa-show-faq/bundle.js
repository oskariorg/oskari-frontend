/**
* @class Oskari.liikennevirasto.bundle.lakapa.LaKaPaShowFAQBundle
* 
*/
Oskari.clazz.define("Oskari.liikennevirasto.bundle.lakapa.LaKaPaShowFAQBundle", function() {
	
}, {
	"create" : function() {
		return Oskari.clazz.create("Oskari.liikennevirasto.bundle.lakapa.LaKaPaShowFAQBundleInstance");
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
				"src" : "../../../../bundles/liikennevirasto/lakapa-show-faq/instance.js"
			},
			{
				"type" : "text/css",
				"src" : "../../../../bundles/liikennevirasto/bundle/lakapa-show-faq/resources/css/style.css"
			}, 
			{
				"language" : "fi",
				"type" : "text/javascript",
				"src" : "../../../../bundles/liikennevirasto/lakapa-show-faq/resources/locale/fi.js"
			},{
				"language" : "en",
				"type" : "text/javascript",
				"src" : "../../../../bundles/liikennevirasto/lakapa-show-faq/resources/locale/en.js"
			},{
				"language" : "sv",
				"type" : "text/javascript",
				"src" : "../../../../bundles/liikennevirasto/lakapa-show-faq/resources/locale/sv.js"
			}],
		"resources" : []
	},
	"bundle" : {
		"manifest" : {
			"Bundle-Identifier" : "lakapa-show-faq",
			"Bundle-Name" : "lakapa-show-faq",
			"Bundle-Author" : [{
				"Name" : "Marko Kuosmanen",
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

Oskari.bundle_manager.installBundleClass("lakapa-show-faq", "Oskari.liikennevirasto.bundle.lakapa.LaKaPaShowFAQBundle");