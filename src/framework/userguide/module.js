define(["oskari","jquery","bundles/framework/bundle/userguide/instance","bundles/framework/bundle/userguide/request/ShowUserGuideRequest","bundles/framework/bundle/userguide/request/ShowUserGuideRequestHandler","bundles/framework/bundle/userguide/service/UserGuideService","bundles/framework/bundle/userguide/Tile","bundles/framework/bundle/userguide/Flyout","css!resources/framework/bundle/userguide/css/style.css","bundles/framework/bundle/userguide/locale/fi","bundles/framework/bundle/userguide/locale/sv","bundles/framework/bundle/userguide/locale/en","bundles/framework/bundle/userguide/locale/cs","bundles/framework/bundle/userguide/locale/de","bundles/framework/bundle/userguide/locale/es"], function(Oskari,jQuery) {
    return Oskari.bundleCls("userguide").category({create: function () {

		return Oskari.clazz.create("Oskari.mapframework.bundle.userguide.UserGuideBundleInstance");
	},update: function (manager, bundle, bi, info) {

	}})
});