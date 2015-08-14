define(["oskari","jquery","bundles/framework/bundle/mapanalysis/plugin/AnalysisLayerPlugin","bundles/framework/bundle/mapanalysis/domain/AnalysisLayer","bundles/framework/bundle/mapanalysis/domain/AnalysisLayerModelBuilder","bundles/framework/bundle/mapanalysis/event/AnalysisVisualizationChangeEvent","bundles/framework/bundle/mapanalysis/locale/fi","bundles/framework/bundle/mapanalysis/locale/sv","bundles/framework/bundle/mapanalysis/locale/en"], function(Oskari,jQuery) {
    return Oskari.bundleCls("mapanalysis").category({create: function () {
            return null;
        },update: function (manager, bundle, bi, info) {
            manager.alert("RECEIVED update notification " + info);
        }})
});