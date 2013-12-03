define([
	"oskari",
	"jquery",
	"src/framework/oskariui/module",
	"./instance",
	"bundles/framework/bundle/mapfull/enhancement/start-map-with-link-enhancement",
	"bundles/framework/bundle/mapfull/request/MapResizeEnabledRequest",
	"bundles/framework/bundle/mapfull/request/MapResizeEnabledRequestHandler",
	"bundles/framework/bundle/mapfull/request/MapWindowFullScreenRequest",
	"bundles/framework/bundle/mapfull/request/MapWindowFullScreenRequestHandler",
	"bundles/framework/bundle/mapstats/module",
	"bundles/framework/bundle/mapwfs/module",
	"css!resources/framework/bundle/mapfull/css/style.css"
], function(Oskari, jQuery) {
	Oskari.bundleCls('oskariui');
	Oskari.bundleCls('openlayers-default-theme');

	Oskari.bundleCls('mapmodule-plugin');

	return Oskari.bundleCls('mapfull').category({
		create: function() {
			return Oskari.cls("Oskari.mapframework.bundle.mapfull.MapFullBundleInstance").create();
		}
	});

});