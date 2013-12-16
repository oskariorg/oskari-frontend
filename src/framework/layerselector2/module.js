define(["oskari","jquery","bundles/framework/bundle/layerselector2/instance","bundles/framework/bundle/layerselector2/Flyout","bundles/framework/bundle/layerselector2/Tile","bundles/framework/bundle/layerselector2/model/LayerGroup","bundles/framework/bundle/layerselector2/view/Layer","bundles/framework/bundle/layerselector2/view/LayersTab","bundles/framework/bundle/layerselector2/view/PublishedLayersTab","css!resources/framework/bundle/layerselector2/css/style.css","bundles/framework/bundle/layerselector2/locale/fi","bundles/framework/bundle/layerselector2/locale/sv","bundles/framework/bundle/layerselector2/locale/en","bundles/framework/bundle/layerselector2/locale/cs","bundles/framework/bundle/layerselector2/locale/de","bundles/framework/bundle/layerselector2/locale/es"], function(Oskari,jQuery) {
    return Oskari.bundleCls("layerselector2").category({create: function () {
		var me = this;
		var inst = Oskari.clazz.create("Oskari.mapframework.bundle.layerselector2.LayerSelectorBundleInstance");

		return inst;

	},update: function (manager, bundle, bi, info) {

	}})
});