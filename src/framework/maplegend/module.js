define(["oskari","jquery","bundles/framework/bundle/maplegend/instance","bundles/framework/bundle/maplegend/Flyout","bundles/framework/bundle/maplegend/Tile","css!resources/framework/bundle/maplegend/css/style.css","bundles/framework/bundle/maplegend/locale/fi","bundles/framework/bundle/maplegend/locale/sv","bundles/framework/bundle/maplegend/locale/en","bundles/framework/bundle/maplegend/locale/cs","bundles/framework/bundle/maplegend/locale/de","bundles/framework/bundle/maplegend/locale/es"], function(Oskari,jQuery) {
    return Oskari.bundleCls("maplegend").category({create: function () {
		var me = this;
		var inst = Oskari.clazz.create("Oskari.mapframework.bundle.maplegend.MapLegendBundleInstance");

		return inst;

	},update: function (manager, bundle, bi, info) {

	}})
});