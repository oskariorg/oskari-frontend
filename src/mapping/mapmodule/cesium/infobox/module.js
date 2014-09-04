define([
	"oskari",
	"jquery",
	"bundles/framework/bundle/infobox/instance",
	"./plugin/CesiumPopupPlugin",
	"bundles/framework/bundle/infobox/request/ShowInfoBoxRequest",
	"bundles/framework/bundle/infobox/request/ShowInfoBoxRequestHandler",
	"bundles/framework/bundle/infobox/request/HideInfoBoxRequest",
	"bundles/framework/bundle/infobox/request/HideInfoBoxRequestHandler",
	"bundles/framework/bundle/infobox/request/RefreshInfoBoxRequest",
	"bundles/framework/bundle/infobox/request/RefreshInfoBoxRequestHandler",
	"bundles/framework/bundle/infobox/event/InfoBoxEvent",
	"css!resources/framework/bundle/infobox/css/infobox.css"
], function(Oskari, jQuery) {
	return Oskari.bundleCls("infobox").category({
		create: function() {
			var me = this;
			var inst =
				Oskari.clazz.create("Oskari.mapframework.bundle.infobox.InfoBoxBundleInstance");
			return inst;

		},
		update: function(manager, bundle, bi, info) {

		}
	})
});