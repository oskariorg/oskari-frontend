define([
	"oskari",
	"jquery",
	"bundles/framework/bundle/oskariui/module",
	"./instance",
	"../../../framework/bundle/mapfull/enhancement/start-map-with-link-enhancement",
	"../../../framework/bundle/mapfull/request/MapResizeEnabledRequest",
	"../../../framework/bundle/mapfull/request/MapResizeEnabledRequestHandler",
	"../../../framework/bundle/mapfull/request/MapWindowFullScreenRequest",
	"../../../framework/bundle/mapfull/request/MapWindowFullScreenRequestHandler",
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