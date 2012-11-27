/**
 * @class Oskari.mapframework.bundle.printout.PrintoutBundle
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define("Oskari.mapframework.bundle.printout.PrintoutBundle", function() {

}, {
	"create" : function() {
		var me = this;
		var inst = Oskari.clazz.create("Oskari.mapframework.bundle.printout.PrintoutBundleInstance");

		return inst;

	},
	"update" : function(manager, bundle, bi, info) {

	}
}, {

	"protocol" : ["Oskari.bundle.Bundle", "Oskari.mapframework.bundle.extension.ExtensionBundle"],
	"source" : {

		"scripts" : [
		{
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/printout/instance.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/printout/Flyout.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/printout/Tile.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/printout/view/StartView.js"
		}, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/printout/view/BasicPrintout.js"
        }, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/printout/request/PrintMapRequest.js"
		}, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/printout/request/PrintMapRequestHandler.js"
        },{
            "type" : "text/css",
            "src" : "../../../../resources/framework/bundle/printout/css/style.css"
        }],

		"locales" : [{
			"lang" : "fi",
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/printout/locale/fi.js"
		}, {
			"lang" : "sv",
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/printout/locale/sv.js"
		}, {
			"lang" : "en",
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/printout/locale/en.js"
		}]
	},
	"bundle" : {
		"manifest" : {
			"Bundle-Identifier" : "printout",
			"Bundle-Name" : "printout",
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

Oskari.bundle_manager.installBundleClass("printout", "Oskari.mapframework.bundle.printout.PrintoutBundle");
