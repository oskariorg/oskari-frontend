define(["oskari","jquery","./instance","./locale/fi","./locale/sv","./locale/en"], function(Oskari,jQuery) {
    return Oskari.bundleCls("backendstatus").category({create: function () {
		var me = this;
		var inst = Oskari.clazz.create("Oskari.mapframework.bundle.backendstatus.BackendStatusBundleInstance");

		return inst;

	},update: function (manager, bundle, bi, info) {

	}})
});