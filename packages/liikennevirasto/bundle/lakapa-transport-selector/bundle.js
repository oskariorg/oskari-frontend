/**
 * @class Oskari.liikennevirasto.bundle.lakapa.TransportSelectorBundle
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define("Oskari.liikennevirasto.bundle.lakapa.TransportSelectorBundle", 

function() {

}, {
	"create" : function() {
		var me = this;
		var inst = 
		  Oskari.clazz.create("Oskari.liikennevirasto.bundle.lakapa.TransportSelectorBundleInstance");
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
			"src" : "../../../../bundles/liikennevirasto/lakapa-transport-selector/instance.js"
		}, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/liikennevirasto/lakapa-transport-selector/plugin/maptransportselectorplugin/LakapaTransportSelectorPlugin.js"
        },
        {
            "type" : "text/javascript",
            "src" : "../../../../bundles/liikennevirasto/lakapa-transport-selector/request/HideSelectionRequest.js"
        },
        {
            "type" : "text/javascript",
            "src" : "../../../../bundles/liikennevirasto/lakapa-transport-selector/request/HideSelectionRequestHandler.js"
        },
        {
            "type" : "text/javascript",
            "src" : "../../../../bundles/liikennevirasto/lakapa-transport-selector/request/ShowBoundingBoxRequest.js"
        },
        {
            "type" : "text/javascript",
            "src" : "../../../../bundles/liikennevirasto/lakapa-transport-selector/request/ShowBoundingBoxRequestHandler.js"
        },
        {
            "type" : "text/javascript",
            "src" : "../../../../bundles/liikennevirasto/lakapa-transport-selector/request/ShowFeatureRequest.js"
        },
        {
            "type" : "text/javascript",
            "src" : "../../../../bundles/liikennevirasto/lakapa-transport-selector/request/ShowFeatureRequestHandler.js"
        },
        {
            "type" : "text/javascript",
            "src" : "../../../../bundles/liikennevirasto/lakapa-transport-selector/request/ShowMessageRequest.js"
        },
        {
            "type" : "text/javascript",
            "src" : "../../../../bundles/liikennevirasto/lakapa-transport-selector/request/ShowMessageRequestHandler.js"
        },
        {
            "type" : "text/javascript",
            "src" : "../../../../bundles/liikennevirasto/lakapa-transport-selector/request/ToggleTransportSelectorRequest.js"
        },
        {
            "type" : "text/javascript",
            "src" : "../../../../bundles/liikennevirasto/lakapa-transport-selector/request/ToggleTransportSelectorRequestHandler.js"
        },
        /* Resources */
        {
		    "type" : "text/css",
		    "src" : "../../../../bundles/liikennevirasto/bundle/lakapa-transport-selector/resources/css/style.css"	  
		}
        ],
		/* Locales */
		"locales" : [{
			"lang" : "fi",
			"type" : "text/javascript",
			"src" : "../../../../bundles/liikennevirasto/lakapa-transport-selector/resources/locale/fi.js"
		}, {
			"lang" : "sv",
			"type" : "text/javascript",
			"src" : "../../../../bundles/liikennevirasto/lakapa-transport-selector/resources/locale/sv.js"
		}, {
			"lang" : "en",
			"type" : "text/javascript",
			"src" : "../../../../bundles/liikennevirasto/lakapa-transport-selector/resources/locale/en.js"
		}
		]
	},
	"bundle" : {
		"manifest" : {
			"Bundle-Identifier" : "lakapa-transport-selector",
			"Bundle-Name" : "lakapa-transport-selector",
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

Oskari.bundle_manager.installBundleClass("lakapa-transport-selector", 
         "Oskari.liikennevirasto.bundle.lakapa.TransportSelectorBundle");
