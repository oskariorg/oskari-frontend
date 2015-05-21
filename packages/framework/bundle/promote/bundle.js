/**
 * @class Oskari.mapframework.bundle.promote.PromoteBundle
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define("Oskari.mapframework.bundle.promote.PromoteBundle", function() {

}, {
	"create" : function() {
		var me = this;
		var inst = Oskari.clazz.create("Oskari.mapframework.bundle.promote.PromoteBundleInstance");

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
			"src" : "../../../../bundles/framework/promote/instance.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/promote/Flyout.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/promote/Tile.js"
		}],

		"locales" : [{
			"lang" : "en",
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/promote/resources/locale/en.js"
		}, {
			"lang" : "es",
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/promote/resources/locale/es.js"
		}, {
			"lang" : "et",
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/promote/resources/locale/et.js"
		}, {
			"lang" : "fi",
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/promote/resources/locale/fi.js"
		}, {
			"lang" : "fr",
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/promote/resources/locale/fr.js"
		}, {
			"lang" : "is",
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/promote/resources/locale/is.js"
		}, {
			"lang" : "it",
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/promote/resources/locale/it.js"
		}, {
			"lang" : "nb",
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/promote/resources/locale/nb.js"
		}, {
			"lang" : "nl",
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/promote/resources/locale/nl.js"
		}, {
			"lang" : "nn",
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/promote/resources/locale/nn.js"
		}, {
			"lang" : "sl",
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/promote/resources/locale/sl.js"
		}, {
			"lang" : "sv",
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/promote/resources/locale/sv.js"
		}]
	},
	"bundle" : {
		"manifest" : {
			"Bundle-Identifier" : "promote",
			"Bundle-Name" : "promote",
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

Oskari.bundle_manager.installBundleClass("promote", "Oskari.mapframework.bundle.promote.PromoteBundle");
