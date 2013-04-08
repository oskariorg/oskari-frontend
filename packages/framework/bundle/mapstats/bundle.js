/**
 * @class Oskari.mapframework.bundle.mapstats.MapStatsBundle
 */
Oskari.clazz.define("Oskari.mapframework.bundle.mapstats.MapStatsBundle", function() {
}, {
	/*
	 * implementation for protocol 'Oskari.bundle.Bundle'
	 */
	"create" : function() {

		return Oskari.clazz.create("Oskari.mapframework.bundle.mapstats.MapStatsBundleInstance");
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
			"src" : "../../../../bundles/framework/bundle/mapstats/plugin/StatsLayerPlugin.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/mapstats/domain/StatsLayer.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/mapstats/domain/StatsLayerModelBuilder.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/mapstats/instance.js"
		}],
		 "locales" : [{
            "lang" : "fi",
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/mapstats/locale/fi.js"
        }, {
            "lang" : "sv",
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/mapstats/locale/sv.js"
        }, {
            "lang" : "en",
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/mapstats/locale/en.js"
        }
       ]
	},
	"bundle" : {
		"manifest" : {
			"Bundle-Identifier" : "mapstats",
			"Bundle-Name" : "mapstats",
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
					"Name" : "Stats",
					"Title" : "Stats"
				},
				"en" : {}
			},
			"Bundle-Version" : "1.0.0",
			"Import-Namespace" : ["Oskari"]
		}
	}
});

Oskari.bundle_manager.installBundleClass("mapstats", "Oskari.mapframework.bundle.mapstats.MapStatsBundle");
