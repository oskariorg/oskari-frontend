/**
 * @class Oskari.mapframework.bundle.MapWmtsBundle
 */
Oskari.clazz.define("Oskari.mapframework.bundle.MapWmtsBundle", function() {
}, {
	/*
	 * implementation for protocol 'Oskari.bundle.Bundle'
	 */
	"create" : function() {

		return null;
	},
	"update" : function(manager, bundle, bi, info) {
		manager.alert("RECEIVED update notification " + info);
	}
},

/**
 * metadata
 */
{

	"protocol" : ["Oskari.bundle.Bundle", "Oskari.mapframework.bundle.extension.ExtensionBundle"],
	"source" : {

		"scripts" : [{
			"type" : "text/javascript",
			"src" : "../../../../bundles/mapping/mapwmts/plugin/WmtsLayerPlugin.ol2.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/mapping/mapwmts/domain/WmtsLayer.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/mapping/mapwmts/domain/WmtsLayerModelBuilder.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/mapping/mapwmts/service/WmtsLayerService.ol2.js"
		}],
		"resources" : []
	},
	"bundle" : {
		"manifest" : {
			"Bundle-Identifier" : "mapwmts",
			"Bundle-Name" : "mapwmts",
			"Bundle-Tag" : {
				"mapframework" : true
			},

			"Bundle-Icon" : {
				"href" : "icon.png"
			},
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
					"Name" : "WMTS",
					"Title" : "WMTS"
				},
				"en" : {}
			},
			"Bundle-Version" : "1.0.0",
			"Import-Namespace" : ["Oskari", "Ext"]
		}
	}
});

/**
 * Install this bundle
 */
Oskari.bundle_manager.installBundleClass("mapwmts", "Oskari.mapframework.bundle.MapWmtsBundle");
