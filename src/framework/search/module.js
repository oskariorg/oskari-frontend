define(["oskari","jquery","bundles/framework/bundle/search/service/searchservice","bundles/framework/bundle/search/instance","bundles/framework/bundle/search/Flyout","bundles/framework/bundle/search/Tile","bundles/framework/bundle/search/request/AddTabRequest","bundles/framework/bundle/search/request/AddTabRequestHandler","bundles/framework/bundle/search/request/AddSearchResultActionRequest","bundles/framework/bundle/search/request/RemoveSearchResultActionRequest","bundles/framework/bundle/search/request/SearchResultActionRequestHandler","css!resources/framework/bundle/search/css/style.css","bundles/framework/bundle/search/locale/hy","bundles/framework/bundle/search/locale/bg","bundles/framework/bundle/search/locale/cs","bundles/framework/bundle/search/locale/da","bundles/framework/bundle/search/locale/de","bundles/framework/bundle/search/locale/en","bundles/framework/bundle/search/locale/es","bundles/framework/bundle/search/locale/et","bundles/framework/bundle/search/locale/fi","bundles/framework/bundle/search/locale/hr","bundles/framework/bundle/search/locale/hu","bundles/framework/bundle/search/locale/lv","bundles/framework/bundle/search/locale/nl","bundles/framework/bundle/search/locale/pl","bundles/framework/bundle/search/locale/pt","bundles/framework/bundle/search/locale/ro","bundles/framework/bundle/search/locale/sr","bundles/framework/bundle/search/locale/sl","bundles/framework/bundle/search/locale/sk","bundles/framework/bundle/search/locale/sq","bundles/framework/bundle/search/locale/sv","bundles/framework/bundle/search/locale/uk"], function(Oskari,jQuery) {
    return Oskari.bundleCls("search").category({create: function () {
        var me = this;
        var inst = Oskari.clazz.create("Oskari.mapframework.bundle.search.SearchBundleInstance");

        return inst;

    },update: function (manager, bundle, bi, info) {

    }})
});