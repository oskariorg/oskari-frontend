define(["oskari","jquery","./instance","./Flyout","./Tile","css!_resources_/framework/bundle/layerselection2/css/style.css","./locale/fi","./locale/sv","./locale/en"], function(Oskari,jQuery) {
    return Oskari.bundleCls("layerselection2").category({create: function () {
		var me = this;
		var inst = Oskari.clazz.create("Oskari.mapframework.bundle.layerselection2.LayerSelectionBundleInstance");

		return inst;

	},update: function (manager, bundle, bi, info) {

	}})
});