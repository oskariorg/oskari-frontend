/**
 * @class Oskari.harava.bundle.haravaInfobox.InfoBoxBundle
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define("Oskari.harava.bundle.haravaInfobox.InfoBoxBundle", 

function() {

}, {
	"create" : function() {
		var me = this;
		var inst = 
		  Oskari.clazz.create("Oskari.harava.bundle.haravaInfobox.InfoBoxBundleInstance");
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
			"src" : "../../../../bundles/harava/bundle/harava-infobox/instance.js"
		}, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/harava/bundle/harava-infobox/plugin/openlayerspopup/OpenlayersPopupPlugin.js"
        },{
            "type" : "text/javascript",
            "src" : "../../../../bundles/harava/bundle/harava-infobox/request/ShowInfoBoxRequest.js"
        },{
            "type" : "text/javascript",
            "src" : "../../../../bundles/harava/bundle/harava-infobox/request/ShowInfoBoxRequestHandler.js"
        },{
            "type" : "text/javascript",
            "src" : "../../../../bundles/harava/bundle/harava-infobox/request/HideInfoBoxRequest.js"
        },{
            "type" : "text/javascript",
            "src" : "../../../../bundles/harava/bundle/harava-infobox/request/HideInfoBoxRequestHandler.js"
        }, {
		    "type" : "text/css",
		    "src" : "../../../../resources/harava/bundle/harava-infobox/css/infobox.css"	  
		}]
	},
	"bundle" : {
		"manifest" : {
			"Bundle-Identifier" : "harava-infobox",
			"Bundle-Name" : "harava-infobox",
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

Oskari.bundle_manager.installBundleClass("harava-infobox", 
         "Oskari.harava.bundle.haravaInfobox.InfoBoxBundle");
