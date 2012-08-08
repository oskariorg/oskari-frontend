/**
 * @class Oskari.sample.bundle.myfirstbundle.SimpleHelloWorldBundle
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define("Oskari.sample.bundle.myfirstbundle.SimpleHelloWorldBundle", 

/**
 * @method create called automatically on construction
 * @static
 */
function() {

}, {
	"create" : function() {
		var me = this;
		var inst = 
		  Oskari.clazz.create("Oskari.sample.bundle.myfirstbundle.SimpleHelloWorldBundleInstance");
		return inst;

	},
	"update" : function(manager, bundle, bi, info) {

	}
}, {

	"protocol" : [ "Oskari.bundle.Bundle" ],
	"source" : {

		"scripts" : [{
			"type" : "text/javascript",
			"src" : "../../../../bundles/sample/bundle/" + 
			        "myfirstbundle/instance.js"
		}]
	},
	"bundle" : {
		"manifest" : {
			"Bundle-Identifier" : "myfirstbundle",
			"Bundle-Name" : "myfirstbundle",
			"Bundle-Author" : [{
				"Name" : "ev",
				"Organisation" : "nls.fi",
				"Temporal" : {
					"Start" : "2009",
					"End" : "2011"
				},
				"Copyleft" : {
					"License" : {
						"License-Name" : "EUPL",
						"License-Online-Resource" : 
						  "http://www.paikkatietoikkuna.fi/license"
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
	},

	/**
	 * @static
	 * @property dependencies
	 */
	"dependencies" : []

});

Oskari.bundle_manager.installBundleClass("myfirstbundle", 
         "Oskari.sample.bundle.myfirstbundle.SimpleHelloWorldBundle");