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
/*			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/mapwfs/plugin/wmtslayer/WmtsLayerPlugin.js"
		}, { */
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/mapwfs/domain/WfsLayer.js"
		}, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/mapwfs/domain/WfsLayerModelBuilder.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/mapwfs/domain/QueuedTile.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/mapwfs/domain/TileQueue.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/mapwfs/domain/WfsTileRequest.js"
        }, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/mapwfs/event/WFSFeaturesSelectedEvent.js"
		}, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/mapwfs/service/WfsTileService.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/mapwfs/plugin/wfslayer/QueuedTilesGrid.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/mapwfs/plugin/wfslayer/QueuedTilesStrategy.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/mapwfs/plugin/wfslayer/WfsLayerPlugin.js"
        }, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/mapwfs/instance.js"
		}],
        "locales" : [{
            "lang" : "fi",
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/mapwfs/locale/fi.js"
        }, {
            "lang" : "sv",
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/mapwfs/locale/sv.js"
        }, {
            "lang" : "en",
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/mapwfs/locale/en.js"
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
