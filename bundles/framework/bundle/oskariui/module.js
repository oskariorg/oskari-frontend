define(["oskari","jquery","./jquery-ui-1.9.1.custom.min","_libraries_/jquery/plugins/jquery.base64.min","css!_resources_/framework/bundle/oskariui/css/jquery-ui-1.9.1.custom.css","css!_resources_/framework/bundle/oskariui/bootstrap-grid.css","./DomManager","./Layout"], function(Oskari,jQuery) {
    return Oskari.bundleCls("oskariui").category({create: function () {


		return this;

	},update: function (manager, bundle, bi, info) {

	},start: function () {
		/* We'll add our own Dom Manager */
		var partsMap = this.conf.partsMap || {};
		var domMgr = Oskari.clazz.create('Oskari.framework.bundle.oskariui.DomManager', jQuery, partsMap);
		Oskari.setDomManager(domMgr);

	},stop: function () {

	}})
});