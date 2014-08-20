define(["oskari","jquery","bundles/framework/bundle/routesearch/instance","bundles/framework/bundle/routesearch/Flyout","bundles/framework/bundle/search/service/searchservice","css!resources/framework/bundle/routesearch/css/routesearch.css","bundles/framework/bundle/routesearch/locale/en","bundles/framework/bundle/routesearch/locale/fi","bundles/framework/bundle/routesearch/locale/sv"], function(Oskari,jQuery) {
    return Oskari.bundleCls("routesearch").category({create: function () {
            return Oskari.clazz.create("Oskari.mapframework.bundle.routesearch.RouteSearchBundleInstance");
        },update: function (manager, bundle, bi, info) {}})
});