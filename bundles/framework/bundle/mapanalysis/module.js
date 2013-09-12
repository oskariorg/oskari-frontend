define(["oskari","jquery","./plugin/AnalysisLayerPlugin","./domain/AnalysisLayer","./domain/AnalysisLayerModelBuilder","./event/AnalysisVisualizationChangeEvent"], function(Oskari,jQuery) {
    return Oskari.bundleCls("mapanalysis").category({create: function () {

		return null;
	},update: function (manager, bundle, bi, info) {
		manager.alert("RECEIVED update notification " + info);
	}})
});