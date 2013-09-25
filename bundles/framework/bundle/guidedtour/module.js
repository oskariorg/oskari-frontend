define(["oskari","jquery","./instance","libraries/jquery/plugins/jquery.cookie","css!resources/framework/bundle/guidedtour/css/style.css","./locale/fi","./locale/sv","./locale/en"], function(Oskari,jQuery) {
    return Oskari.bundleCls("guidedtour").category({create: function () {
            var me = this;
            var inst = Oskari.clazz.create(
                "Oskari.framework.bundle.guidedtour.GuidedTourBundleInstance"
            );
            return inst;
        },update: function (manager, bundle, bi, info) {
        }})
});