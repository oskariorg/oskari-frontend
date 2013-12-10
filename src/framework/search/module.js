define(["oskari","jquery","bundles/framework/bundle/search/service/searchservice","bundles/framework/bundle/search/instance","bundles/framework/bundle/search/Flyout","bundles/framework/bundle/search/Tile","css!resources/framework/bundle/search/css/style.css","bundles/framework/bundle/search/locale/fi","bundles/framework/bundle/search/locale/sv","bundles/framework/bundle/search/locale/en","bundles/framework/bundle/search/locale/cs","bundles/framework/bundle/search/locale/de","bundles/framework/bundle/search/locale/es"], function(Oskari,jQuery) {
    return Oskari.bundleCls("search").category({create: function () {
		var me = this;
		var inst = Oskari.clazz.create("Oskari.mapframework.bundle.search.SearchBundleInstance");

		return inst;

	},update: function (manager, bundle, bi, info) {

	}})
});