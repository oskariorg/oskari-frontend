define(["oskari","jquery","bundles/framework/bundle/metadata/instance","bundles/framework/bundle/metadata/plugin/MapSelectionPlugin","bundles/framework/bundle/metadata/event/MapSelectionEvent","css!resources/framework/bundle/metadata/css/buttons.css"], function(Oskari,jQuery) {
    return Oskari.bundleCls("metadata").category({create: function () {
        var me = this;
        var inst = Oskari.clazz.create("Oskari.mapframework.bundle.metadata.MetadataSearchInstance");
        return inst;

    },update: function (manager, bundle, bi, info) {

    }})
});