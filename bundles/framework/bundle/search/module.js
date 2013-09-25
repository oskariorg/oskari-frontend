define(["oskari","jquery","./service/searchservice","./instance","./Flyout","./Tile","css!resources/framework/bundle/search/css/style.css","./locale/fi","./locale/sv","./locale/en","./locale/cs","./locale/de","./locale/es"], function(Oskari,jQuery) {
    return Oskari.bundleCls("search").category({create: function () {
		var me = this;
		var inst = Oskari.clazz.create("Oskari.mapframework.bundle.search.SearchBundleInstance");

		return inst;

	},update: function (manager, bundle, bi, info) {

	}})
});