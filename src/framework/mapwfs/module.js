define(["oskari","jquery","bundles/framework/bundle/mapwfs/domain/WfsLayer","bundles/framework/bundle/mapwfs/domain/WfsLayerModelBuilder","bundles/framework/bundle/mapwfs/domain/QueuedTile","bundles/framework/bundle/mapwfs/domain/TileQueue","bundles/framework/bundle/mapwfs/domain/WfsTileRequest","bundles/framework/bundle/mapwfs/event/WFSFeaturesSelectedEvent","bundles/framework/bundle/mapwfs/service/WfsTileService","bundles/framework/bundle/mapwfs/plugin/wfslayer/QueuedTilesGrid","bundles/framework/bundle/mapwfs/plugin/wfslayer/QueuedTilesStrategy","bundles/framework/bundle/mapwfs/plugin/wfslayer/WfsLayerPlugin","bundles/framework/bundle/mapwfs/instance","bundles/framework/bundle/mapwfs/locale/fi","bundles/framework/bundle/mapwfs/locale/sv","bundles/framework/bundle/mapwfs/locale/en"], function(Oskari,jQuery) {
    return Oskari.bundleCls("mapwfs").category({create: function () {

		return Oskari.clazz.create("Oskari.mapframework.bundle.mapwfs.MapWfsBundleInstance");
	},update: function (manager, bundle, bi, info) {
		manager.alert("RECEIVED update notification " + info);
	}})
});