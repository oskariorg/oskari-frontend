/**
 * @class Oskari.statistics.bundle.statsgrid.StatsGridBundle
 *
 * Definitpation for bundle. See source for details.
 */
Oskari.clazz.define("Oskari.statistics.bundle.statsgrid.StatsGridBundle",
/**
 * @method create called automatically on construction
 * @static
 */
function() {

}, {
	"create" : function() {
		return Oskari.clazz.create("Oskari.statistics.bundle.statsgrid.StatsGridBundleInstance",
			 'statsgrid');
	},
	"update" : function(manager, bundle, bi, info) {

	}
}, {

	"protocol" : ["Oskari.bundle.Bundle", "Oskari.mapframework.bundle.extension.ExtensionBundle"],
	"source" : {

		"scripts" : [{
			"type" : "text/javascript",
			"src" : "../../../../bundles/statistics/bundle/statsgrid/instance.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/statistics/bundle/statsgrid/View.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/statistics/bundle/statsgrid/ViewSample.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/statistics/bundle/statsgrid/ViewSampleToolbar.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/statistics/bundle/statsgrid/ViewSampleTable.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/statistics/bundle/statsgrid/ViewSampleMapOps.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/statistics/bundle/statsgrid/ViewSampleMainViewHacks.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/statistics/bundle/statsgrid/Stats.js"
		}, {
			"type" : "text/css",
			"src" : "../../../../resources/statistics/bundle/statsgrid/css/style.css"
		}],

		"locales" : [{
			"lang" : "fi",
			"type" : "text/javascript",
			"src" : "../../../../bundles/statistics/bundle/statsgrid/locale/fi.js"
		}, {
			"lang" : "sv",
			"type" : "text/javascript",
			"src" : "../../../../bundles/statistics/bundle/statsgrid/locale/sv.js"
		}, {
			"lang" : "en",
			"type" : "text/javascript",
			"src" : "../../../../bundles/statistics/bundle/statsgrid/locale/en.js"
		}]
	},
	"bundle" : {
		"manifest" : {
			"Bundle-Identifier" : "statsgrid",
			"Bundle-Name" : "statsgrid",
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

Oskari.bundle_manager.installBundleClass("statsgrid", "Oskari.statistics.bundle.statsgrid.StatsGridBundle");
