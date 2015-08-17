/**
 * @class Oskari.liikennevirasto.bundle.lakapa.layerselector2.LayerSelectorBundle
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define("Oskari.liikennevirasto.bundle.lakapa.layerselector2.LayerSelectorBundle", function() {

}, {
	"create" : function() {
		var me = this;
		var inst = Oskari.clazz.create("Oskari.liikennevirasto.bundle.lakapa.layerselector2.LayerSelectorBundleInstance");

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
			"src" : "../../../../bundles/liikennevirasto/bundle/lakapa-layerselector2/instance.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/liikennevirasto/bundle/lakapa-layerselector2/Flyout.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/liikennevirasto/bundle/lakapa-layerselector2/Tile.js"
		}, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/liikennevirasto/bundle/lakapa-layerselector2/model/LayerGroup.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/liikennevirasto/bundle/lakapa-layerselector2/view/Layer.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/liikennevirasto/bundle/lakapa-layerselector2/view/LayersTab.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/liikennevirasto/bundle/lakapa-layerselector2/view/PublishedLayersTab.js"
        }, {
			"type" : "text/css",
			"src" : "../../../../bundles/liikennevirasto/bundle/lakapa-layerselector2/resources/css/style.css"
		}],

		"locales" : [{
			"lang" : "fi",
			"type" : "text/javascript",
			"src" : "../../../../bundles/liikennevirasto/bundle/lakapa-layerselector2/resources/locale/fi.js"
		}, {
			"lang" : "sv",
			"type" : "text/javascript",
			"src" : "../../../../bundles/liikennevirasto/bundle/lakapa-layerselector2/resources/locale/sv.js"
		}, {
			"lang" : "en",
			"type" : "text/javascript",
			"src" : "../../../../bundles/liikennevirasto/bundle/lakapa-layerselector2/resources/locale/en.js"
		}]
	},
	"bundle" : {
		"manifest" : {
			"Bundle-Identifier" : "lakapa-layerselector2",
			"Bundle-Name" : "layerselector2",
			"Bundle-Author" : [{
				"Name" : "Marko Kuosmanen",
				"Organisation" : "Dimenteq Oy",
				"Temporal" : {
					"Start" : "2013",
					"End" : "2014"
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
	 */
	"dependencies" : ["jquery"]

});

Oskari.bundle_manager.installBundleClass("lakapa-layerselector2", "Oskari.liikennevirasto.bundle.lakapa.layerselector2.LayerSelectorBundle");
