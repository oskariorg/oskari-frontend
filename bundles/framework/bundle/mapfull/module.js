define([
	"oskari",
	"jquery",
	"./instance",
	"./enhancement/start-map-with-link-enhancement",
	"./request/MapResizeEnabledRequest",
	"./request/MapResizeEnabledRequestHandler",
	"./request/MapWindowFullScreenRequest",
	"./request/MapWindowFullScreenRequestHandler",
	"css!resources/framework/bundle/mapfull/css/style.css"
], function(Oskari, jQuery) {
	return Oskari.bundleCls("mapfull").category({
		create: function() {
			return Oskari.clazz.create("Oskari.mapframework.bundle.mapfull.MapFullBundleInstance");
		},
		update: function(manager, bundle, bi, info) {

		}
	})
});