define([
	"oskari",
	"jquery",
	"../../../framework/bundle/infobox/instance",
	"./plugin/OpenLayersPopupPlugin",
	"../../../framework/bundle/infobox/request/ShowInfoBoxRequest",
	"../../../framework/bundle/infobox/request/ShowInfoBoxRequestHandler",
	"../../../framework/bundle/infobox/request/HideInfoBoxRequest",
	"../../../framework/bundle/infobox/request/HideInfoBoxRequestHandler",
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