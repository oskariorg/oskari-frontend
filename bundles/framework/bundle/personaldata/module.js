define(["oskari","jquery","./instance","./Flyout","./Tile","./MyPlacesTab","./MyViewsTab","./service/ViewService","./PublishedMapsTab","./AccountTab","css!resources/framework/bundle/personaldata/css/personaldata.css","./locale/fi","./locale/sv","./locale/en"], function(Oskari,jQuery) {
    return Oskari.bundleCls("personaldata").category({create: function () {
		var me = this;
		var inst = Oskari.clazz.create("Oskari.mapframework.bundle.personaldata.PersonalDataBundleInstance");
		return inst;

	},update: function (manager, bundle, bi, info) {

	}})
});