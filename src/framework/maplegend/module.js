define(["oskari","jquery","bundles/framework/bundle/maplegend/instance","bundles/framework/bundle/maplegend/Flyout","bundles/framework/bundle/maplegend/Tile","css!resources/framework/bundle/maplegend/css/style.css","bundles/framework/bundle/maplegend/locale/am","bundles/framework/bundle/maplegend/locale/bg","bundles/framework/bundle/maplegend/locale/cs","bundles/framework/bundle/maplegend/locale/da","bundles/framework/bundle/maplegend/locale/de","bundles/framework/bundle/maplegend/locale/en","bundles/framework/bundle/maplegend/locale/es","bundles/framework/bundle/maplegend/locale/et","bundles/framework/bundle/maplegend/locale/fi","bundles/framework/bundle/maplegend/locale/ge","bundles/framework/bundle/maplegend/locale/gr","bundles/framework/bundle/maplegend/locale/hr","bundles/framework/bundle/maplegend/locale/hu","bundles/framework/bundle/maplegend/locale/lv","bundles/framework/bundle/maplegend/locale/nl","bundles/framework/bundle/maplegend/locale/pl","bundles/framework/bundle/maplegend/locale/pt","bundles/framework/bundle/maplegend/locale/ro","bundles/framework/bundle/maplegend/locale/rs","bundles/framework/bundle/maplegend/locale/sl","bundles/framework/bundle/maplegend/locale/sk","bundles/framework/bundle/maplegend/locale/sq","bundles/framework/bundle/maplegend/locale/sv","bundles/framework/bundle/maplegend/locale/uk"], function(Oskari,jQuery) {
    return Oskari.bundleCls("maplegend").category({create: function () {
        var me = this;
        var inst = Oskari.clazz.create("Oskari.mapframework.bundle.maplegend.MapLegendBundleInstance");

        return inst;

    },update: function (manager, bundle, bi, info) {

    }})
});