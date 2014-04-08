define(["oskari","jquery","bundles/framework/bundle/layerselector2/instance","bundles/framework/bundle/layerselector2/Flyout","bundles/framework/bundle/layerselector2/Tile","bundles/framework/bundle/layerselector2/model/LayerGroup","bundles/framework/bundle/layerselector2/view/Layer","bundles/framework/bundle/layerselector2/view/LayersTab","bundles/framework/bundle/layerselector2/view/PublishedLayersTab","css!resources/framework/bundle/layerselector2/css/style.css","bundles/framework/bundle/layerselector2/locale/am","bundles/framework/bundle/layerselector2/locale/bg","bundles/framework/bundle/layerselector2/locale/cs","bundles/framework/bundle/layerselector2/locale/da","bundles/framework/bundle/layerselector2/locale/de","bundles/framework/bundle/layerselector2/locale/en","bundles/framework/bundle/layerselector2/locale/es","bundles/framework/bundle/layerselector2/locale/et","bundles/framework/bundle/layerselector2/locale/fi","bundles/framework/bundle/layerselector2/locale/ge","bundles/framework/bundle/layerselector2/locale/gr","bundles/framework/bundle/layerselector2/locale/hr","bundles/framework/bundle/layerselector2/locale/hu","bundles/framework/bundle/layerselector2/locale/lv","bundles/framework/bundle/layerselector2/locale/nl","bundles/framework/bundle/layerselector2/locale/pl","bundles/framework/bundle/layerselector2/locale/pt","bundles/framework/bundle/layerselector2/locale/rs","bundles/framework/bundle/layerselector2/locale/sl","bundles/framework/bundle/layerselector2/locale/sk","bundles/framework/bundle/layerselector2/locale/sq","bundles/framework/bundle/layerselector2/locale/sv","bundles/framework/bundle/layerselector2/locale/uk"], function(Oskari,jQuery) {
    return Oskari.bundleCls("layerselector2").category({create: function () {
        var me = this;
        var inst = Oskari.clazz.create("Oskari.mapframework.bundle.layerselector2.LayerSelectorBundleInstance");

        return inst;

    },update: function (manager, bundle, bi, info) {

    }})
});