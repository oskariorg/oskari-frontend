define(["oskari","jquery","./instance","./plugin/CoordinatesPlugin","css!resources/framework/bundle/coordinatedisplay/css/coordinatedisplay.css","./locale/fi","./locale/sv","./locale/en","./locale/cs","./locale/de","./locale/es"], function(Oskari,jQuery) {
    return Oskari.bundleCls("coordinatedisplay").category({create: function () {
		var me = this;
		var inst = 
		  Oskari.clazz.create("Oskari.mapframework.bundle.coordinatedisplay.CoordinateDisplayBundleInstance");
		return inst;

	},update: function (manager, bundle, bi, info) {

	}})
});