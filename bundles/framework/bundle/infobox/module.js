define(["oskari","jquery","./instance","./plugin/openlayerspopup/OpenlayersPopupPlugin","./request/ShowInfoBoxRequest","./request/ShowInfoBoxRequestHandler","./request/HideInfoBoxRequest","./request/HideInfoBoxRequestHandler","css!resources/framework/bundle/infobox/css/infobox.css"], function(Oskari,jQuery) {
    return Oskari.bundleCls("infobox").category({create: function () {
		var me = this;
		var inst = 
		  Oskari.clazz.create("Oskari.mapframework.bundle.infobox.InfoBoxBundleInstance");
		return inst;

	},update: function (manager, bundle, bi, info) {

	}})
});