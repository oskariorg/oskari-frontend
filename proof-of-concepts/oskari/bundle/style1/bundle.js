Oskari.clazz.define("Oskari.poc.oskari.Style1Bundle", function() {

}, {
	"create" : function() {

		return this;
		/*
		 * Oskari.clazz
		 * .create("Oskari.mapframework.bundle.Style1BundleInstance");
		 */
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

		"scripts" : [{
			"type" : "text/css",
			"src" : "css/style.css"

		}, {
			"type" : "text/css",
			"src" : "css/divman.css"

		}, {
			"type" : "text/css",
			"src" : "css/index.css"

		}],
		"resources" : []
	},
	"bundle" : {
		"manifest" : {
			"Bundle-Identifier" : "style1",
			"Bundle-Name" : "style1",
			"Bundle-Author" : [{
				"Name" : "jjk",
				"Organisation" : "nls.fi",
				"Temporal" : {
					"Start" : "2009",
					"End" : "2011"
				},
				"Copyleft" : {
					"License" : {
						"License-Name" : "EUPL",
						"License-Online-Resource" : "http://www.paikkatietoikkuna.fi/license"
					}
				}
			}],
			"Bundle-Name-Locale" : {
				"fi" : {
					"Name" : " style-1",
					"Title" : " style-1"
				},
				"en" : {}
			},
			"Bundle-Version" : "1.0.0",
			"Import-Namespace" : ["Oskari"],
			"Import-Bundle" : {}
		}
	}
});

Oskari.bundle_manager.installBundleClass("style1", "Oskari.poc.oskari.Style1Bundle");
