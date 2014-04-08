define(["oskari","jquery","bundles/framework/bundle/mapstats/plugin/StatsLayerPlugin","bundles/framework/bundle/mapstats/domain/StatsLayer","bundles/framework/bundle/mapstats/domain/StatsLayerModelBuilder","bundles/framework/bundle/mapstats/event/StatsVisualizationChangeEvent","bundles/framework/bundle/mapstats/event/FeatureHighlightedEvent","bundles/framework/bundle/mapstats/event/HoverTooltipContentEvent","css!resources/framework/bundle/mapstats/css/mapstats.css","bundles/framework/bundle/mapstats/locale/fi","bundles/framework/bundle/mapstats/locale/sv","bundles/framework/bundle/mapstats/locale/en"], function(Oskari,jQuery) {
    return Oskari.bundleCls("mapstats").category({create: function () {
            return null;
        },update: function (manager, bundle, bi, info) {
            manager.alert("RECEIVED update notification " + info);
        }})
});