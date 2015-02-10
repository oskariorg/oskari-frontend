/**
 * @class Oskari.mapframework.bundle.mapwfs.MapWfsBundleBundle
 */
Oskari.clazz.define("Oskari.mapframework.bundle.mapwfs.MapWfsBundle", function() {
}, {
	/*
	 * implementation for protocol 'Oskari.bundle.Bundle'
	 */
	"create" : function() {

		return Oskari.clazz.create("Oskari.mapframework.bundle.mapwfs.MapWfsBundleInstance");
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

		"scripts" : [
		{
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/mapwfs/domain/WfsLayer.js"
		}, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/mapwfs/domain/WfsLayerModelBuilder.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/mapwfs/domain/QueuedTile.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/mapwfs/domain/TileQueue.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/mapwfs/domain/WfsTileRequest.js"
        }, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/mapwfs/event/WFSFeaturesSelectedEvent.js"
		}, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/mapwfs/service/WfsTileService.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/mapwfs/plugin/wfslayer/QueuedTilesGrid.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/mapwfs/plugin/wfslayer/QueuedTilesStrategy.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/mapwfs/plugin/wfslayer/WfsLayerPlugin.js"
        }, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/mapwfs/instance.js"
		}],
        "locales" : [{
            "lang" : "fi",
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/mapwfs/resources/locale/fi.js"
        }, {
            "lang" : "sv",
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/mapwfs/resources/locale/sv.js"
        }, {
            "lang" : "en",
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/mapwfs/resources/locale/en.js"
        }, {
            "lang" : "es",
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/mapwfs/resources/locale/es.js"
        }
       ]
	},
	"bundle" : {
		"manifest" : {
			"Bundle-Identifier" : "mapwfs",
			"Bundle-Name" : "mapwfs",
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
					"Name" : "WFS",
					"Title" : "WFS"
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
Oskari.bundle_manager.installBundleClass("mapwfs", "Oskari.mapframework.bundle.mapwfs.MapWfsBundle");
