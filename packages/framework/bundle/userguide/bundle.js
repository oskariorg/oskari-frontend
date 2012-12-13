/**
 * @class Oskari.userinterface.bundle.ui.UserInterfaceBundle
 *
 *
 */

Oskari.clazz.define("Oskari.mapframework.bundle.userguide.UserGuideBundle", function() {

}, {
	/**
	 * @method create creates an Oskari DIV Manager instance
	 * @return {Oskari.userinterface.bundle.ui.UserInterfaceBundleInstance}
	 */
	"create" : function() {

		return Oskari.clazz.create("Oskari.mapframework.bundle.userguide.UserGuideBundleInstance");
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
			"src" : "../../../../bundles/framework/bundle/userguide/instance.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/userguide/request/ShowUserGuideRequest.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/userguide/request/ShowUserGuideRequestHandler.js"
		},{
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/userguide/service/UserGuideService.js"
		},{
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/userguide/Tile.js"
		},{
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/userguide/Flyout.js"
        },{
			"type" : "text/css",
			"src" : "../../../../resources/framework/bundle/userguide/css/style.css"
		}],
		"locales" : [		
		{
			"lang" : "fi",
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/userguide/locale/fi.js"
		}, {
			"lang" : "sv",
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/userguide/locale/sv.js"
		},{
			"lang" : "en",
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/userguide/locale/en.js"
		}]
	},
	"bundle" : {
		/**
		 * @static
		 * @property bundle.manifest
		 */
		"manifest" : {
			"Bundle-Identifier" : "userguide",
			"Bundle-Name" : "userguide",
			"Bundle-Tag" : {
				"mapframework" : true
			},

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
					"Name" : "userguide",
					"Title" : "userguide"
				},
				"en" : {}
			},
			"Bundle-Version" : "1.0.0",
			"Import-Namespace" : ["Oskari"],
			"Import-Bundle" : {}
		}
	}
});

Oskari.bundle_manager.installBundleClass("userguide", "Oskari.mapframework.bundle.userguide.UserGuideBundle");
