define(["oskari","jquery","bundles/framework/bundle/mapmyplaces/plugin/MyPlacesLayerPlugin","bundles/framework/bundle/mapmyplaces/domain/MyPlacesLayer","bundles/framework/bundle/mapmyplaces/event/MyPlacesVisualizationChangeEvent","bundles/framework/bundle/mapmyplaces/domain/MyPlacesLayerModelBuilder","bundles/framework/bundle/mapmyplaces/locale/fi","bundles/framework/bundle/mapmyplaces/locale/sv","bundles/framework/bundle/mapmyplaces/locale/en"], function(Oskari,jQuery) {
    return Oskari.bundleCls("mapmyplaces").category({create: function () {

            return null;
        },update: function (manager, bundle, bi, info) {
            manager.alert("RECEIVED update notification " + info);
        }})
});