define(["oskari","jquery","bundles/framework/bundle/promote/instance","bundles/framework/bundle/promote/Flyout","bundles/framework/bundle/promote/Tile","bundles/framework/bundle/promote/locale/fi","bundles/framework/bundle/promote/locale/sv","bundles/framework/bundle/promote/locale/en"], function(Oskari,jQuery) {
    return Oskari.bundleCls("promote").category({create: function () {
		var me = this;
		var inst = Oskari.clazz.create("Oskari.mapframework.bundle.promote.PromoteBundleInstance");

		return inst;

	},update: function (manager, bundle, bi, info) {

	}})
});