define(["oskari","jquery","./service/searchservice","./instance","./Flyout","./Tile","css!_resources_/framework/bundle/search/css/style.css","./locale/fi","./locale/sv","./locale/en"], function(Oskari,jQuery) {
    return Oskari.bundleCls("search").category({create: function () {
		var me = this;
		var inst = Oskari.clazz.create("Oskari.mapframework.bundle.search.SearchBundleInstance");

		return inst;

	},update: function (manager, bundle, bi, info) {

	}})
});