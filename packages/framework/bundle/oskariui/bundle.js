/**
 * @class Oskari.mapframework.bundle.oskariui.OskariUIBundle
 *
 * Bundle to add Map Layer Legends to application. 
 * 
 */
Oskari.clazz.define("Oskari.mapframework.bundle.oskariui.OskariUIBundle", function() {

}, {
	"create" : function() {
		return this;

	},
	"update" : function(manager, bundle, bi, info) {

	},
	
	"start" : function() {
		
	},
	
	"stop" : function() {
		
	}
	
	
}, {

	"protocol" : ["Oskari.bundle.Bundle","Oskari.bundle.BundleInstance"],
	"source" : {

		"scripts" : [
		{
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/oskariui/jquery-ui-1.9.1.custom.min.js"
		}, {
			"type" : "text/css",
			"src" : "../../../../resources/framework/bundle/oskariui/css/jquery-ui-1.9.1.custom.css"
		}],

		"locales" : []
	},
	"bundle" : {
		"manifest" : {
			"Bundle-Identifier" : "oskariui",
			"Bundle-Name" : "oskariui",
			"Bundle-Author" : [{
				"Name" : "jjk",
				"Organisation" : "nls.fi",
				"Temporal" : {
					"Start" : "2012"
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
			"Import-Namespace" : ["Oskari", "jquery"],
			"Import-Bundle" : {}
		}
	},

	/**
	 * @static
	 * @property dependencies
	 */
	"dependencies" : ["jquery"]

});

Oskari.bundle_manager.installBundleClass("oskariui", "Oskari.mapframework.bundle.oskariui.OskariUIBundle");
