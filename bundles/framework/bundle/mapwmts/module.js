define(["oskari","jquery","./plugin/wmtslayer/WmtsLayerPlugin","./domain/WmtsLayer","./service/WmtsLayerService","./service/WmtsLayerModelBuilder","./instance"], function(Oskari,jQuery) {
    return Oskari.bundleCls("mapwmts").category({create: function () {

		return Oskari.clazz.create("Oskari.mapframework.bundle.MapWmtsBundleInstance");
	},update: function (manager, bundle, bi, info) {
		manager.alert("RECEIVED update notification " + info);
	}})
});