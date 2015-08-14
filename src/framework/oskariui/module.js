define([
	"src/oskari/oskari",
	"jquery",
	"libraries/jquery/jquery-ui-1.9.2.custom-modified",
	"libraries/jquery/plugins/jquery.base64-modified",
	"css!resources/framework/bundle/oskariui/css/jquery-ui-1.9.2.custom",
	"css!resources/framework/bundle/oskariui/bootstrap-grid",
	"bundles/framework/bundle/oskariui/DomManager",
	"bundles/framework/bundle/oskariui/Layout"
], function(Oskari, jQuery) {
	return Oskari.bundleCls("oskariui").category({
		create: function() {
			return this;
		},
		update: function(manager, bundle, bi, info) {
		},
		start: function() {
			/* We'll add our own Dom Manager */
			var partsMap = this.conf.partsMap || {};
			var domMgr = Oskari.clazz.create('Oskari.framework.bundle.oskariui.DomManager', jQuery, partsMap);
			Oskari.setDomManager(domMgr);
		},
		stop: function() {
		}
	})
});