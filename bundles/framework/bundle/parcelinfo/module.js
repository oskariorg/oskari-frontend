define(["oskari","jquery","./instance","./plugin/ParcelInfoPlugin","css!_resources_/framework/bundle/parcelinfo/css/parcelinfo.css","./locale/fi"], function(Oskari,jQuery) {
    return Oskari.bundleCls("parcelinfo").category({create: function () {
        var me = this;
        var inst = Oskari.clazz.create("Oskari.mapframework.bundle.parcelinfo.ParcelInfoInstance");
        return inst;
    },update: function (manager, bundle, bi, info) {
    }})
});