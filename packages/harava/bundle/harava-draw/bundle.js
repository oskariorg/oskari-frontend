/**
 * @class Oskari.harava.bundle.haravaDraw.DrawBundle
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define("Oskari.harava.bundle.haravaDraw.DrawBundle", 

function() {

}, {
	"create" : function() {
		var me = this;
		var inst = 
		  Oskari.clazz.create("Oskari.harava.bundle.haravaDraw.DrawBundleInstance");
		return inst;

	},
	"update" : function(manager, bundle, bi, info) {

	}
}, {

	"protocol" : [ "Oskari.bundle.Bundle",
	               "Oskari.mapframework.bundle.extension.ExtensionBundle" ],
	"source" : {

		"scripts" : [{
			"type" : "text/javascript",
			"src" : "../../../../bundles/harava/bundle/harava-draw/instance.js"
		}, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/harava/bundle/harava-draw/plugin/draw/HaravaDrawPlugin.js"
        }, 
        /*
         * Requests and handlers
         */
        {
            "type" : "text/javascript",
            "src" : "../../../../bundles/harava/bundle/harava-draw/request/ToggleVisibilityHaravaDrawRequest.js"
        },
        {
            "type" : "text/javascript",
            "src" : "../../../../bundles/harava/bundle/harava-draw/request/ToggleVisibilityHaravaDrawRequestHandler.js"
        },
        /*
        {
            "type" : "text/javascript",
            "src" : "../../../../bundles/harava/bundle/harava-search-by-geometry/request/StopGeometrySearchRequest.js"
        },
        {
            "type" : "text/javascript",
            "src" : "../../../../bundles/harava/bundle/harava-search-by-geometry/request/StopGeometrySearchRequestHandler.js"
        },
                 **/
        /* Resources */
        {
		    "type" : "text/css",
		    "src" : "../../../../resources/harava/bundle/harava-draw/css/style.css"	  
		}],
		/* Locales */
		"locales" : [{
			"lang" : "fi",
			"type" : "text/javascript",
			"src" : "../../../../bundles/harava/bundle/harava-draw/locale/fi.js"
		}, {
			"lang" : "sv",
			"type" : "text/javascript",
			"src" : "../../../../bundles/harava/bundle/harava-draw/locale/sv.js"
		}, {
			"lang" : "en",
			"type" : "text/javascript",
			"src" : "../../../../bundles/harava/bundle/harava-draw/locale/en.js"
		}
		]
	},
	"bundle" : {
		"manifest" : {
			"Bundle-Identifier" : "harava-draw",
			"Bundle-Name" : "harava-draw",
			"Bundle-Author" : [{
				"Name" : "MK",
				"Organisation" : "Dimenteq Oy",
				"Temporal" : {
					"Start" : "2012",
					"End" : "2013"
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
	"dependencies" : [ "jquery" ]

});

Oskari.bundle_manager.installBundleClass("harava-draw", 
         "Oskari.harava.bundle.haravaDraw.DrawBundle");
