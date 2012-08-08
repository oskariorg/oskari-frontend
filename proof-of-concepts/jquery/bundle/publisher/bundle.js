/**
 * @class Oskari.poc.jquery.FeatureInfoBundle
 *
 * Bundle that manages jquery requirements. Instance calls 'require'
 *
 */
Oskari.clazz.define("Oskari.poc.jquery.PublisherBundle", function() {

}, {
	"require" : function(cb) {

		var me = this;
		var metas = Oskari.clazz.metadata('Oskari.poc.jquery.PublisherBundle');
		var dependencies = metas.meta.dependencies;
    cb();
		/*YUI(yuiconfig).use(yuilibrarydeps, function(Y) {
			cb(Y);
		});*/
	},
	"create" : function() {
		var me = this;
		var inst = Oskari.clazz.create("Oskari.poc.jquery.bundle.PublisherBundleInstance");
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
		},{
			"type" : "text/css",
			"src" : "../../../../resources/framework/bundle/publisher/css/style.css"
		}],
		"locales" : [{
			"lang" : "fi",
			"type" : "text/javascript",
			"src" : "locale/fi.js"
		}, {
			"lang" : "sv",
			"type" : "text/javascript",
			"src" : "locale/sv.js"
		}, {
			"lang" : "en",
			"type" : "text/javascript",
			"src" : "locale/en.js"
		}]
	},
	"bundle" : {
		"manifest" : {
			"Bundle-Identifier" : "publisher",
			"Bundle-Name" : "publisher",
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
			"Import-Namespace" : ["Oskari"],
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
	"dependencies" : ["jquery"]

});

Oskari.bundle_manager.installBundleClass("publisher", "Oskari.poc.jquery.PublisherBundle");
