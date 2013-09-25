define(["oskari","jquery","./instance","./Flyout","./Tile","./model/LayerGroup","./view/Layer","./view/LayersTab","./view/PublishedLayersTab","css!resources/framework/bundle/layerselector2/css/style.css","./locale/fi","./locale/sv","./locale/en"], function(Oskari,jQuery) {
    return Oskari.bundleCls("layerselector2").category({create: function () {
		var me = this;
		var inst = Oskari.clazz.create("Oskari.mapframework.bundle.layerselector2.LayerSelectorBundleInstance");

		return inst;

	},update: function (manager, bundle, bi, info) {

	}})
});