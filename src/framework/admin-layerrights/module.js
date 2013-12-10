define(["oskari","jquery","bundles/framework/bundle/admin-layerrights/instance","bundles/framework/bundle/admin-layerrights/Flyout","bundles/framework/bundle/admin-layerrights/Tile","css!resources/framework/bundle/admin-layerrights/css/style.css","libraries/chosen/chosen.jquery","css!libraries/chosen/chosen.css","bundles/framework/bundle/admin-layerrights/locale/fi","bundles/framework/bundle/admin-layerrights/locale/sv","bundles/framework/bundle/admin-layerrights/locale/en"], function(Oskari,jQuery) {
    return Oskari.bundleCls("admin-layerrights").category({create: function () {
        var me = this;
        
        /* this would be enough when only flyout will be implemented */
        /*
        var inst = Oskari.clazz.create("Oskari.userinterface.extension.DefaultExtension",
            'helloworld',
            "Oskari.sample.bundle.helloworld.HelloWorldFlyout"
            );
        */

        /* or this if you want to tailor instance also */
        var inst = Oskari.clazz.create("Oskari.framework.bundle.admin-layerrights.AdminLayerRightsBundleInstance",
            'admin-layerrights',
            "Oskari.framework.bundle.admin-layerrights.AdminLayerRightsFlyout"
            );

        return inst;

    },update: function (manager, bundle, bi, info) {

    }})
});