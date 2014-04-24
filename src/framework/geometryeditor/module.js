define(["oskari","jquery","bundles/framework/bundle/geometryeditor/plugin/GeometryEditorLayerPlugin","bundles/framework/bundle/geometryeditor/domain/GeometryEditorLayer","bundles/framework/bundle/geometryeditor/event/GeometryEditorChangeEvent","bundles/framework/bundle/geometryeditor/domain/GeometryEditorLayerModelBuilder","bundles/framework/bundle/geometryeditor/locale/fi","bundles/framework/bundle/geometryeditor/locale/sv","bundles/framework/bundle/geometryeditor/locale/en"], function(Oskari,jQuery) {
    return Oskari.bundleCls("geometryeditor").category({create: function () {

        return null;
    },update: function (manager, bundle, bi, info) {
        manager.alert("RECEIVED update notification " + info);
    }})
});