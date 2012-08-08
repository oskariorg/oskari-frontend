/**
 * @class Oskari.poc.yuilibrary.LayerSelectorBundle
 *
 * Bundle that manages yuilibrary requirements. Instance calls 'require'
 *
 */
Oskari.clazz.define("Oskari.poc.yuilibrary.LayerSelectorBundle", function() {

	/**
	 * @property yuilibrary
	 */
	this.yuilibrary = null;
}, {
	"require" : function(cb) {

		var me = this;
		var metas = Oskari.clazz.metadata('Oskari.poc.yuilibrary.LayerSelectorBundle');
		var yuiconfig = metas.meta.yuiconfig;
		var yuilibrarydeps = metas.meta.yuilibrary;

		YUI(yuiconfig).use(yuilibrarydeps, function(Y) {
			cb(Y);
		});
	},
	"create" : function() {
		var me = this;
		var inst = Oskari.clazz.create("Oskari.poc.yuilibrary.bundle.LayerSelectorBundleInstance");

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
			"Import-Namespace" : ["Oskari", "yuilibrary"],
			"Import-Bundle" : {}

			/**
			 *
			 */

		}
	},

	/**
	 * @static
	 * @property yuilibrary
	 *
	 * yuilibrary dependencies for this bundle (TBD)
	 */
	"yuilibrary" : ['node', 'tabview'],
	"yuiconfig" : {
		/*skin : 'night'*/
	}

});

Oskari.bundle_manager.installBundleClass("layerselector", "Oskari.poc.yuilibrary.LayerSelectorBundle");
