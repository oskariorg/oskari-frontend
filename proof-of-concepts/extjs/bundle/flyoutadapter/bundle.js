/**
 * @class Oskari.poc.dojo.LayerSelectionBundle
 *
 * Bundle that manages dojo requirements.
 * Instance calls 'require'
 *
 */
Oskari.clazz.define("Oskari.poc.extjs.bundle.FlyoutAdapterBundle", function() {

	/**
	 * @property dojo
	 */
	this.dojo = null;
}, {

	"create" : function() {
		var me = this;
		var inst = Oskari.clazz.create("Oskari.poc.extjs.bundle.FlyoutAdapterBundleInstance");

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

		}, {
			"type" : "text/javascript",
			"src" : "Extension.js"

		}, {
			"type" : "text/javascript",
			"src" : "ui/manager/flyout-ui-facade.js"

		}],
		"resources" : []
	},
	"bundle" : {
		"manifest" : {
			"Bundle-Identifier" : "flyoutadapter",
			"Bundle-Name" : "flyoutadapter",
			"Bundle-Author" : [{
				"Name" : "jjk",
				"Organisation" : "nls.fi",
				"Temporal" : {
					"Start" : "2009",
					"End" : "2012"
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
			"Import-Namespace" : ["Oskari", "Ext"],
			"Import-Bundle" : {}

			/**
			 *
			 */

		}
	}
});

Oskari.bundle_manager.installBundleClass("flyoutadapter", "Oskari.poc.extjs.bundle.FlyoutAdapterBundle");
