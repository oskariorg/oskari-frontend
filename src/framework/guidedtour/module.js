define([
    "oskari",
    "i18n!./nls/locale",
    "jquery",
    "bundles/framework/bundle/guidedtour/instance",
    "libraries/jquery/plugins/jquery.cookie",
    "css!resources/framework/bundle/guidedtour/css/style.css"
],
function(Oskari, locale, jQuery) {
    return Oskari.bundleCls("guidedtour").category({
        create: function() {
            var me = this;
            var inst = Oskari.clazz.create(
                "Oskari.framework.bundle.guidedtour.GuidedTourBundleInstance",
                locale
            );
            return inst;
        },
        update: function(manager, bundle, bi, info) {}
    })
});