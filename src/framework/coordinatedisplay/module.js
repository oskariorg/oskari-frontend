define(["oskari","jquery","src/mapping/mapmodule/plugin/AbstractMapModulePlugin","src/mapping/mapmodule/plugin/BasicMapModulePlugin","bundles/framework/bundle/coordinatedisplay/instance","bundles/framework/bundle/coordinatedisplay/plugin/CoordinatesPlugin","css!resources/framework/bundle/coordinatedisplay/css/coordinatedisplay.css","bundles/framework/bundle/coordinatedisplay/locale/bg","bundles/framework/bundle/coordinatedisplay/locale/cs","bundles/framework/bundle/coordinatedisplay/locale/da","bundles/framework/bundle/coordinatedisplay/locale/de","bundles/framework/bundle/coordinatedisplay/locale/en","bundles/framework/bundle/coordinatedisplay/locale/es","bundles/framework/bundle/coordinatedisplay/locale/et","bundles/framework/bundle/coordinatedisplay/locale/fi","bundles/framework/bundle/coordinatedisplay/locale/el","bundles/framework/bundle/coordinatedisplay/locale/hr","bundles/framework/bundle/coordinatedisplay/locale/lv","bundles/framework/bundle/coordinatedisplay/locale/nl","bundles/framework/bundle/coordinatedisplay/locale/pl","bundles/framework/bundle/coordinatedisplay/locale/pt","bundles/framework/bundle/coordinatedisplay/locale/ro","bundles/framework/bundle/coordinatedisplay/locale/sl","bundles/framework/bundle/coordinatedisplay/locale/sv","bundles/framework/bundle/coordinatedisplay/locale/uk"], function(Oskari,jQuery) {
    return Oskari.bundleCls("coordinatedisplay").category({create: function () {
        var me = this,
            inst = Oskari.clazz.create("Oskari.mapframework.bundle.coordinatedisplay.CoordinateDisplayBundleInstance");
        return inst;

    },update: function (manager, bundle, bi, info) {

    }})
});