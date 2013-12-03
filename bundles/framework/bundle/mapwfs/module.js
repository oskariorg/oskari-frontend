define([
	"oskari",
	"jquery",
	"./domain/WfsLayer",
	"./domain/WfsLayerModelBuilder",
	"./domain/QueuedTile",
	"./domain/TileQueue",
	"./domain/WfsTileRequest",
	"./event/WFSFeaturesSelectedEvent",
	"./service/WfsTileService",
	"./plugin/wfslayer/QueuedTilesGrid",
	"./plugin/wfslayer/QueuedTilesStrategy",
	"./plugin/wfslayer/WfsLayerPlugin",
	"./instance",
	"./locale/fi",
	"./locale/sv",
	"./locale/en"
], function(Oskari,jQuery) {
    return Oskari.bundleCls("mapwfs").category({create: function () {

		return Oskari.clazz.create("Oskari.mapframework.bundle.mapwfs.MapWfsBundleInstance");
	},update: function (manager, bundle, bi, info) {
		manager.alert("RECEIVED update notification " + info);
	}})
});