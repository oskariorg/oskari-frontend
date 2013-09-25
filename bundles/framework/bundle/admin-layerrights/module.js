define(["oskari","jquery","./instance","./Flyout","./Tile","css!resources/framework/bundle/admin-layerrights/css/style.css","libraries/chosen/chosen.jquery.js","css!libraries/chosen/chosen.css","./locale/fi","./locale/sv","./locale/en"], function(Oskari,jQuery) {
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