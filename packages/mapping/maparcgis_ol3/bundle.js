/**
 * @class Oskari.arcgis.bundle.arcgis.MapArcGisBundle
 */
Oskari.clazz.define("Oskari.arcgis.bundle.arcgis.MapArcGisBundle", function() {
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
			"src" : "../../../bundles/mapping/maparcgis_ol3/plugin/ArcGisLayerPlugin.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../bundles/mapping/maparcgis_ol3/domain/ArcGisLayer.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../bundles/mapping/maparcgis_ol3/domain/ArcGis93Layer.js"
		}
       ]
	},
	"bundle" : {
		"manifest" : {
			"Bundle-Identifier" : "maparcgis_ol3",
			"Bundle-Name" : "maparcgis_ol3",
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
					"Name" : "ArcGis",
					"Title" : "ArcGis"
				},
				"en" : {}
			},
			"Bundle-Version" : "1.0.0",
			"Import-Namespace" : ["Oskari"]
		}
	}
});

Oskari.bundle_manager.installBundleClass("maparcgis_ol3", "Oskari.arcgis.bundle.arcgis.MapArcGisBundle");
