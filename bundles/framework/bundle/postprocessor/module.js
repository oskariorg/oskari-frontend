define(["oskari","jquery","./instance"], function(Oskari,jQuery) {
    return Oskari.bundleCls("postprocessor").category({create: function () {
		return Oskari.clazz.create("Oskari.mapframework.bundle.postprocessor.PostProcessorBundleInstance");
	},update: function (manager, bundle, bi, info) {

	}})
});