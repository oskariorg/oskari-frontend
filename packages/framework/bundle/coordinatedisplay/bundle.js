/**
 * @class Oskari.mapframework.bundle.coordinatedisplay.CoordinateDisplayBundle
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define("Oskari.mapframework.bundle.coordinatedisplay.CoordinateDisplayBundle", function() {

}, {
	"create" : function() {
		var me = this;
		var inst = 
		  Oskari.clazz.create("Oskari.mapframework.bundle.coordinatedisplay.CoordinateDisplayBundleInstance");
		return inst;

	},
	"update" : function(manager, bundle, bi, info) {

	}
}, {

	"protocol" : [ "Oskari.bundle.Bundle" ],
	"source" : {

		"scripts" : [{
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/coordinatedisplay/instance.js"
		}, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/coordinatedisplay/plugin/CoordinatesPlugin.js"
        }, {
		    "type" : "text/css",
		    "src" : "../../../../resources/framework/bundle/coordinatedisplay/css/coordinatedisplay.css"	  
		}],
		"locales" : [{
			"lang" : "fi",
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/coordinatedisplay/locale/fi.js"
		}, {
			"lang" : "sv",
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/coordinatedisplay/locale/sv.js"
		}, {
			"lang" : "en",
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/coordinatedisplay/locale/en.js"
		}]
	},
	"bundle" : {
		"manifest" : {
			"Bundle-Identifier" : "coordinatedisplay",
			"Bundle-Name" : "coordinatedisplay",
			"Bundle-Author" : [{
				"Name" : "ah",
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
	"dependencies" : [ "jquery" ]

});

Oskari.bundle_manager.installBundleClass("coordinatedisplay", 
                                         "Oskari.mapframework.bundle" +
                                         ".coordinatedisplay" + 
                                         ".CoordinateDisplayBundle");
