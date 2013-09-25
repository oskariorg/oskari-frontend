define(["oskari","jquery","./instance","./Flyout","./Tile","css!resources/framework/bundle/maplegend/css/style.css","./locale/fi","./locale/sv","./locale/en","./locale/cs","./locale/de","./locale/es"], function(Oskari,jQuery) {
    return Oskari.bundleCls("maplegend").category({create: function () {
		var me = this;
		var inst = Oskari.clazz.create("Oskari.mapframework.bundle.maplegend.MapLegendBundleInstance");

		return inst;

	},update: function (manager, bundle, bi, info) {

	}})
});