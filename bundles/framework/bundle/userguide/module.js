define(["oskari","jquery","./instance","./request/ShowUserGuideRequest","./request/ShowUserGuideRequestHandler","./service/UserGuideService","./Tile","./Flyout","css!_resources_/framework/bundle/userguide/css/style.css","./locale/fi","./locale/sv","./locale/en"], function(Oskari,jQuery) {
    return Oskari.bundleCls("userguide").category({create: function () {

		return Oskari.clazz.create("Oskari.mapframework.bundle.userguide.UserGuideBundleInstance");
	},update: function (manager, bundle, bi, info) {

	}})
});