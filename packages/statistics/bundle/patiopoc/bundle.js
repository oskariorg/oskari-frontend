/**
 * @class Oskari.statistics.bundle.patiopoc.PatioBundle
 *
 * Definitpation for bundle. See source for details.
 */
Oskari.clazz.define("Oskari.statistics.bundle.patiopoc.PatioPocBundle",
/**
 * @method create called automatically on construction
 * @static
 */
function() {

}, {
	"create" : function() {
		return Oskari.clazz.create("Oskari.statistics.bundle.patiopoc.PatioPocBundleInstance",
			 'patiopoc');
	},
	"update" : function(manager, bundle, bi, info) {

	}
}, {

	"protocol" : ["Oskari.bundle.Bundle", "Oskari.mapframework.bundle.extension.ExtensionBundle"],
	"source" : {

		"scripts" : [{
			"type" : "text/javascript",
			"src" : "../../../../bundles/statistics/bundle/patiopoc/instance.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/statistics/bundle/patiopoc/View.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/statistics/bundle/patiopoc/ViewSample.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/statistics/bundle/patiopoc/ViewSampleToolbar.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/statistics/bundle/patiopoc/ViewSampleTable.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/statistics/bundle/patiopoc/ViewSampleMapOps.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/statistics/bundle/patiopoc/ViewSampleMainViewHacks.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/statistics/bundle/patiopoc/Stats.js"
		}, {
			"type" : "text/css",
			"src" : "../../../../resources/statistics/bundle/patiopoc/css/style.css"
		}],

		"locales" : [{
			"lang" : "fi",
			"type" : "text/javascript",
			"src" : "../../../../bundles/statistics/bundle/patiopoc/locale/fi.js"
		}, {
			"lang" : "sv",
			"type" : "text/javascript",
			"src" : "../../../../bundles/statistics/bundle/patiopoc/locale/sv.js"
		}, {
			"lang" : "en",
			"type" : "text/javascript",
			"src" : "../../../../bundles/statistics/bundle/patiopoc/locale/en.js"
		}]
	},
	"bundle" : {
		"manifest" : {
			"Bundle-Identifier" : "patiopoc",
			"Bundle-Name" : "patiopoc",
			"Bundle-Author" : [{
				"Name" : "jjk",
				"Organisatpation" : "nls.fi",
				"Temporal" : {
					"Start" : "2013",
					"End" : "2013"
				},
				"Copyleft" : {
					"License" : {
						"License-Name" : "EUPL",
						"License-Online-Resource" : "http://www.paikkatietoikkuna.fi/license"
					}
				}
			}],
			"Bundle-Verspation" : "1.0.0",
			"Import-Namespace" : ["Oskari"],
			"Import-Bundle" : {}

		}
	},

	/**
	 * @static
	 * @property dependencies
	 */
	"dependencies" : ["jquery"]

});

Oskari.bundle_manager.installBundleClass("patiopoc", "Oskari.statistics.bundle.patiopoc.PatioPocBundle");
