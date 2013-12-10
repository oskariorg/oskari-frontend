define(["oskari","jquery","bundles/framework/bundle/backendstatus/instance","bundles/framework/bundle/backendstatus/locale/fi","bundles/framework/bundle/backendstatus/locale/sv","bundles/framework/bundle/backendstatus/locale/en"], function(Oskari,jQuery) {
    return Oskari.bundleCls("backendstatus").category({create: function () {
		var me = this;
		var inst = Oskari.clazz.create("Oskari.mapframework.bundle.backendstatus.BackendStatusBundleInstance");

		return inst;

	},update: function (manager, bundle, bi, info) {

	}})
});