/**
 * @class Oskari.userinterface.bundle.ui.UserInterfaceBundle
 *
 *
 */

Oskari.clazz.define("Oskari.userinterface.bundle.ui.UserInterfaceBundle", function() {

}, {
	/**
	 * @method create creates an Oskari DIV Manager instance
	 * @return {Oskari.userinterface.bundle.ui.UserInterfaceBundleInstance}
	 */
	"create" : function() {

		return Oskari.clazz.create("Oskari.userinterface.bundle.ui.UserInterfaceBundleInstance");
	},
	/**
	 * @method update called by the bundle manager to inform on changes in bundlage
	 */
	"update" : function(manager, bundle, bi, info) {

	}
}, {
	/**
	 * @static
	 * @property protocol protocols implemented by this bundle
	 */
	"protocol" : ["Oskari.bundle.Bundle"],
	"source" : {
		/**
		 * @static
		 * @property source.scripts
		 *
		 */
		"scripts" : [{
			"type" : "text/javascript",
			"src" : "instance.js"
		}, {
			"type" : "text/javascript",
			"src" : "request/AddExtensionRequest.js",

		}, {
			"type" : "text/javascript",
			"src" : "request/AddExtensionRequestHandler.js",

		}, {
			"type" : "text/javascript",
			"src" : "request/RemoveExtensionRequest.js",

		}, {
			"type" : "text/javascript",
			"src" : "request/RemoveExtensionRequestHandler.js",

		}, {
			"type" : "text/javascript",
			"src" : "request/UpdateExtensionRequest.js",

		}, {
			"type" : "text/javascript",
			"src" : "request/UpdateExtensionRequestHandler.js",

		}],
		"resources" : []
	},
	"bundle" : {
		/**
		 * @static
		 * @property bundle.manifest
		 */
		"manifest" : {
			"Bundle-Identifier" : "ui",
			"Bundle-Name" : "ui",
			/*"Bundle-Tag" : {
				"mapframework" : true
			},*/

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
					"Name" : " kpI",
					"Title" : " kpI"
				},
				"en" : {}
			},
			"Bundle-Version" : "1.0.0",
			"Import-Namespace" : ["Oskari"],
			"Import-Bundle" : {}
		}
	}
});

Oskari.bundle_manager.installBundleClass("ui", "Oskari.userinterface.bundle.ui.UserInterfaceBundle");
