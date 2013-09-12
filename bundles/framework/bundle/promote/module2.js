define(["oskari","jquery",
            "./instance",
            "./Flyout",
            "./Tile",
            "./locale/en",
            "./locale/fi",
            "./locale/sv"
], function(Oskari,jQuery) {
    return Oskari.bundleCls('promote').category({
        create: function() {
            var me = this;
    // Old way       var inst = Oskari.clazz.create("Oskari.mapframework.bundle.promote.PromoteBundleInstance");
            var inst = Oskari.cls("Oskari.mapframework.bundle.promote.PromoteBundleInstance").create();
            return inst;
        }
    })
});