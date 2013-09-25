/**
 * @class Oskari.mapframework.bundle.maplegend.MapLegendBundle
 *
 * Bundle to add Map Layer Legends to application. 
 * 
 */
Oskari.clazz.define("Oskari.mapframework.bundle.maplegend.MapLegendBundle", function() {

}, {
	"create" : function() {
		var me = this;
		var inst = Oskari.clazz.create("Oskari.mapframework.bundle.maplegend.MapLegendBundleInstance");

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
			"src" : "../../../../bundles/framework/bundle/maplegend/instance.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/maplegend/Flyout.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/maplegend/Tile.js"
		}, {
			"type" : "text/css",
			"src" : "../../../../resources/framework/bundle/maplegend/css/style.css"
		}],

		"locales" : [{
			"lang" : "fi",
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/maplegend/locale/fi.js"
		}, {
			"lang" : "sv",
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/maplegend/locale/sv.js"
		}, {
			"lang" : "en",
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/maplegend/locale/en.js"
		}, {
			"lang" : "cs",
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/maplegend/locale/cs.js"
		}, {
			"lang" : "de",
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/maplegend/locale/de.js"
		}, {
			"lang" : "es",
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/maplegend/locale/es.js"
		}]
	},
	"bundle" : {
		"manifest" : {
			"Bundle-Identifier" : "maplegend",
			"Bundle-Name" : "maplegend",
			"Bundle-Author" : [{
				"Name" : "jjk",
				"Organisation" : "nls.fi",
				"Temporal" : {
					"Start" : "2012"
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

Oskari.bundle_manager.installBundleClass("maplegend", "Oskari.mapframework.bundle.maplegend.MapLegendBundle");
