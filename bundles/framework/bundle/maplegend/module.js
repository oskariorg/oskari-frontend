define(["oskari","jquery","./instance","./Flyout","./Tile","css!_resources_/framework/bundle/maplegend/css/style.css","./locale/fi","./locale/sv","./locale/en"], function(Oskari,jQuery) {
    return Oskari.bundleCls("maplegend").category({create: function () {
		var me = this;
		var inst = Oskari.clazz.create("Oskari.mapframework.bundle.maplegend.MapLegendBundleInstance");

		return inst;

	},update: function (manager, bundle, bi, info) {

	}})
});