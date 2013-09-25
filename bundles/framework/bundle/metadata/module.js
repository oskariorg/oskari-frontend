define(["oskari","jquery","./instance","./plugin/MapSelectionPlugin","./event/MapSelectionEvent","css!resources/framework/bundle/metadata/css/buttons.css"], function(Oskari,jQuery) {
    return Oskari.bundleCls("metadata").category({create: function () {
        var me = this;
        var inst = Oskari.clazz.create("Oskari.mapframework.bundle.metadata.MetadataSearchInstance");
        return inst;

    },update: function (manager, bundle, bi, info) {

    }})
});