/**
 * @class Oskari.poc.jquery.LayerSelectionBundle
 *
 * Bundle that manages jquery requirements. Instance calls 'require'
 *
 */
Oskari.clazz.define("Oskari.poc.jquery.LayerSelectionBundle", function() {

}, {
	"require" : function(cb) {

		var me = this;
		var metas = Oskari.clazz.metadata('Oskari.poc.jquery.LayerSelectionBundle');
		var dependencies = metas.meta.dependencies;
		cb();
	},
	"create" : function() {
		var me = this;
		var inst = Oskari.clazz.create("Oskari.poc.jquery.bundle.LayerSelectionBundleInstance");

		return inst;

	},
	"update" : function(manager, bundle, bi, info) {

	}
}, {

	"protocol" : ["Oskari.bundle.Bundle", "Oskari.mapframework.bundle.extension.ExtensionBundle"],
	"source" : {

		"scripts" : [{
			"type" : "text/javascript",
			"src" : "instance.js"

		}, {
			"type" : "text/javascript",
			"src" : "Flyout.js"

		}, {
			"type" : "text/javascript",
			"src" : "Tile.js"

		}],
		"resources" : []
	},
	"bundle" : {
		"manifest" : {
			"Bundle-Identifier" : "layerselection",
			"Bundle-Name" : "layerselection",
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

			/**
			 *
			 */

		}
	},

	/**
	 * @static
	 * @property dependencies
	 *
	 */
	"dependencies" : ["jquery"]

});

Oskari.bundle_manager.installBundleClass("layerselection", "Oskari.poc.jquery.LayerSelectionBundle");
