define(["oskari","jquery","./instance","./Flyout","./Tile","./locale/fi","./locale/sv","./locale/en"], function(Oskari,jQuery) {
    return Oskari.bundleCls("promote").category({create: function () {
		var me = this;
		var inst = Oskari.clazz.create("Oskari.mapframework.bundle.promote.PromoteBundleInstance");

		return inst;

	},update: function (manager, bundle, bi, info) {

	}})
});