/**
 * @class Oskari.liikennevirasto.bundle.lakapa-SaveUserMapStateBundle
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define("Oskari.liikennevirasto.bundle.lakapa.SaveUserMapStateBundle", 

function() {

}, {
	"create" : function() {
		var me = this;
		var inst = 
		  Oskari.clazz.create("Oskari.liikennevirasto.bundle.lakapa.SaveUserMapStateBundleInstance");
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
			"src" : "../../../../bundles/liikennevirasto/lakapa-save-user-map-state/instance.js"
		}, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/liikennevirasto/lakapa-save-user-map-state/plugin/mapstateplugin/LakapaMapStatePlugin.js"
        }, 
        /* Resources */
        {
		    "type" : "text/css",
		    "src" : "../../../../bundles/liikennevirasto/bundle/lakapa-save-user-map-state/resources/css/style.css"	  
		}
        ],
		/* Locales */
		"locales" : [{
			"lang" : "fi",
			"type" : "text/javascript",
			"src" : "../../../../bundles/liikennevirasto/lakapa-save-user-map-state/resources/locale/fi.js"
		}, {
			"lang" : "sv",
			"type" : "text/javascript",
			"src" : "../../../../bundles/liikennevirasto/lakapa-save-user-map-state/resources/locale/sv.js"
		}, {
			"lang" : "en",
			"type" : "text/javascript",
			"src" : "../../../../bundles/liikennevirasto/lakapa-save-user-map-state/resources/locale/en.js"
		}
		]
	},
	"bundle" : {
		"manifest" : {
			"Bundle-Identifier" : "lakapa-save-user-map-state",
			"Bundle-Name" : "lakapa-save-user-map-state",
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

Oskari.bundle_manager.installBundleClass("lakapa-save-user-map-state", 
         "Oskari.liikennevirasto.bundle.lakapa.SaveUserMapStateBundle");
