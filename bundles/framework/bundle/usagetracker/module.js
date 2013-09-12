define(["oskari","jquery","./instance"], function(Oskari,jQuery) {
    return Oskari.bundleCls("usagetracker").category({create: function () {

        return Oskari.clazz.create("Oskari.mapframework.bundle.usagetracker.UsageTrackerBundleInstance");
    },update: function (manager, bundle, bi, info) {

    }})
});