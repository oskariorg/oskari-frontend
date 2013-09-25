define(["oskari","jquery","./plugin/StatsLayerPlugin","./domain/StatsLayer","./domain/StatsLayerModelBuilder","./event/StatsVisualizationChangeEvent","./event/FeatureHighlightedEvent","./event/HoverTooltipContentEvent","css!resources/framework/bundle/mapstats/css/mapstats.css","./locale/fi","./locale/sv","./locale/en"], function(Oskari,jQuery) {
    return Oskari.bundleCls("mapstats").category({create: function () {

		return null;
	},update: function (manager, bundle, bi, info) {
		manager.alert("RECEIVED update notification " + info);
	}})
});