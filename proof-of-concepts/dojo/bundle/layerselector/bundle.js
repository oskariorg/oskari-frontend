/**
 * @class Oskari.poc.dojo.LayerSelectionBundle
 *
 * Bundle that manages dojo requirements.
 * Instance calls 'require'
 *
 */
Oskari.clazz.define("Oskari.poc.dojo.LayerSelectorBundle", function() {

	/**
	 * @property dojo
	 */
	this.dojo = null;
}, {

	"require" : function(cb) {

		var me = this;
		var metas = Oskari.clazz.metadata('Oskari.poc.dojo.LayerSelectorBundle');
		var dojodeps = metas.meta.dojo;

		require(dojodeps, function() {
			var dojo = {};

			for(var d = 0; d < dojodeps.length; d++) {
				var dkey = dojodeps[d];
				dojo[dkey] = arguments[d]

			}

			cb(dojo);

		});
	},
	"create" : function() {
		var me = this;
		var inst = Oskari.clazz.create("Oskari.poc.dojo.bundle.LayerSelectorBundleInstance");

		return inst;

	},
	"start" : function() {

	},
	"stop" : function() {
	},
	"update" : function(manager, bundle, bi, info) {

	}
}, {

	"protocol" : ["Oskari.bundle.Bundle", "Oskari.bundle.BundleInstance", "Oskari.mapframework.bundle.extension.ExtensionBundle"],
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
			"Bundle-Identifier" : "layerselector",
			"Bundle-Name" : "layerselector",
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
			"Import-Namespace" : ["Oskari", "dojo"],
			"Import-Bundle" : {}

			/**
			 *
			 */

		}
	},

	/**
	 * @static
	 * @property dojo
	 *
	 * dojo dependencies for this bundle
	 */
	
	"dojo" : ["dojo", "dojo/dom", "dojo/dom-construct", "dojo/parser", "dojox/grid/DataGrid", "dojo/store/Memory", "dojo/data/ObjectStore", "dojo/query"]
});

Oskari.bundle_manager.installBundleClass("layerselector", "Oskari.poc.dojo.LayerSelectorBundle");
