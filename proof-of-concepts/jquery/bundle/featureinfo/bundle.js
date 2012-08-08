/**
 * @class Oskari.poc.jquery.FeatureInfoBundle
 *
 * Bundle that manages jquery requirements. Instance calls 'require'
 *
 */
Oskari.clazz.define("Oskari.poc.jquery.FeatureInfoBundle", function() {

}, {
	"require" : function(cb) {

		var me = this;
		var metas = Oskari.clazz.metadata('Oskari.poc.jquery.FeatureInfoBundle');
		var dependencies = metas.meta.dependencies;
    cb();
		/*YUI(yuiconfig).use(yuilibrarydeps, function(Y) {
			cb(Y);
		});*/
	},
	"create" : function() {
		var me = this;
		var inst = Oskari.clazz.create("Oskari.poc.jquery.bundle.FeatureInfoBundleInstance");
		return inst;

	},
	"update" : function(manager, bundle, bi, info) {

	}
}, {

	"protocol" : ["Oskari.bundle.Bundle", "Oskari.mapframework.bundle.extension.ExtensionBundle"],
	"source" : {

		"scripts" : [
		{
			// External lib css - JQuery Datatables plugin
			"type" : "text/css",
			"src" : "../../../../libraries/jquery/plugins/DataTables-1.9.0/media/css/jquery.dataTables.css"
		}, {
			// External lib - JQuery Datatables plugin - for advanced table functionality
			// http://datatables.net/examples/
			"type" : "text/javascript",
			"src" : "../../../../libraries/jquery/plugins/DataTables-1.9.0/media/js/jquery.dataTables.min.js"
		}, {
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
			"Bundle-Identifier" : "featureinfo",
			"Bundle-Name" : "featureinfo",
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

Oskari.bundle_manager.installBundleClass("featureinfo", "Oskari.poc.jquery.FeatureInfoBundle");
