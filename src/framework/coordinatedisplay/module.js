define(["oskari","jquery","bundles/framework/bundle/coordinatedisplay/instance","bundles/framework/bundle/coordinatedisplay/plugin/CoordinatesPlugin","css!resources/framework/bundle/coordinatedisplay/css/coordinatedisplay.css","bundles/framework/bundle/coordinatedisplay/locale/fi","bundles/framework/bundle/coordinatedisplay/locale/sv","bundles/framework/bundle/coordinatedisplay/locale/en","bundles/framework/bundle/coordinatedisplay/locale/cs","bundles/framework/bundle/coordinatedisplay/locale/de","bundles/framework/bundle/coordinatedisplay/locale/es"], function(Oskari,jQuery) {
    return Oskari.bundleCls("coordinatedisplay").category({create: function () {
        var me = this,
            inst = Oskari.clazz.create("Oskari.mapframework.bundle.coordinatedisplay.CoordinateDisplayBundleInstance");
        return inst;

    },update: function (manager, bundle, bi, info) {

    }})
});