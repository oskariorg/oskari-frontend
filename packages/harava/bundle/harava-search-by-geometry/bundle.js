/**
 * @class Oskari.harava.bundle.haravaInfobox.InfoBoxBundle
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define("Oskari.harava.bundle.haravaSearchByGeometry.SearchByGeometryBundle", 

function() {

}, {
	"create" : function() {
		var me = this;
		var inst = 
		  Oskari.clazz.create("Oskari.harava.bundle.haravaSearchByGeometry.SearchByGeometryBundleInstance");
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
			"src" : "../../../../bundles/harava/bundle/harava-search-by-geometry/instance.js"
		}, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/harava/bundle/harava-search-by-geometry/plugin/drawsearchgeometry/HaravaDrawSearchGeometryPlugin.js"
        }, 
        /*
         * Requests and handlers
         **/
        {
            "type" : "text/javascript",
            "src" : "../../../../bundles/harava/bundle/harava-search-by-geometry/request/StartGeometrySearchRequest.js"
        },
        {
            "type" : "text/javascript",
            "src" : "../../../../bundles/harava/bundle/harava-search-by-geometry/request/StartGeometrySearchRequestHandler.js"
        },
        {
            "type" : "text/javascript",
            "src" : "../../../../bundles/harava/bundle/harava-search-by-geometry/request/StopGeometrySearchRequest.js"
        },
        {
            "type" : "text/javascript",
            "src" : "../../../../bundles/harava/bundle/harava-search-by-geometry/request/StopGeometrySearchRequestHandler.js"
        },
        /* Resources */
        {
		    "type" : "text/css",
		    "src" : "../../../../resources/harava/bundle/harava-search-by-geometry/css/style.css"	  
		}],
		/* Locales */
		"locales" : [{
			"lang" : "fi",
			"type" : "text/javascript",
			"src" : "../../../../bundles/harava/bundle/harava-search-by-geometry/locale/fi.js"
		}, {
			"lang" : "sv",
			"type" : "text/javascript",
			"src" : "../../../../bundles/harava/bundle/harava-search-by-geometry/locale/sv.js"
		}, {
			"lang" : "en",
			"type" : "text/javascript",
			"src" : "../../../../bundles/harava/bundle/harava-search-by-geometry/locale/en.js"
		}
		]
	},
	"bundle" : {
		"manifest" : {
			"Bundle-Identifier" : "harava-search-by-geometry",
			"Bundle-Name" : "harava-search-by-geometry",
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

Oskari.bundle_manager.installBundleClass("harava-search-by-geometry", 
         "Oskari.harava.bundle.haravaSearchByGeometry.SearchByGeometryBundle");
