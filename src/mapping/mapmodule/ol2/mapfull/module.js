define([
	"oskari",
	"jquery",
	"oskariui",
	"../mapmodule-plugin/module",
	"bundles/framework/bundle/mapfull/instance",
	"bundles/framework/bundle/mapfull/enhancement/start-map-with-link-enhancement",
	"bundles/framework/bundle/mapfull/request/MapResizeEnabledRequest",
	"bundles/framework/bundle/mapfull/request/MapResizeEnabledRequestHandler",
	"bundles/framework/bundle/mapfull/request/MapWindowFullScreenRequest",
	"bundles/framework/bundle/mapfull/request/MapWindowFullScreenRequestHandler",
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