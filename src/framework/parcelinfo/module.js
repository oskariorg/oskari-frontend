define(["oskari","jquery","bundles/framework/bundle/parcelinfo/instance","bundles/framework/bundle/parcelinfo/plugin/ParcelInfoPlugin","css!resources/framework/bundle/parcelinfo/css/parcelinfo.css","bundles/framework/bundle/parcelinfo/locale/fi"], function(Oskari,jQuery) {
    return Oskari.bundleCls("parcelinfo").category({create: function () {
        var me = this;
        var inst = Oskari.clazz.create("Oskari.mapframework.bundle.parcelinfo.ParcelInfoInstance");
        return inst;
    },update: function (manager, bundle, bi, info) {
    }})
});