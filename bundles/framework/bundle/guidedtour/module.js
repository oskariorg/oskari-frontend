define(["oskari","jquery","./instance","_libraries_/jquery/plugins/jquery.cookie","css!_resources_/framework/bundle/guidedtour/css/style.css","./locale/fi","./locale/sv","./locale/en"], function(Oskari,jQuery) {
    return Oskari.bundleCls("guidedtour").category({create: function () {
            var me = this;
            var inst = Oskari.clazz.create(
                "Oskari.framework.bundle.guidedtour.GuidedTourBundleInstance"
            );
            return inst;
        },update: function (manager, bundle, bi, info) {
        }})
});