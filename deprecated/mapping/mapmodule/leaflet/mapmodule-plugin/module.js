define([
	"oskari",
	"jquery-ui",
	"src/oskari/base/module",
	"../../AbstractMapModule",
	"../../plugin/AbstractMapModulePlugin",
	"../../AbstractMapLayerPlugin",

	"src/mapping/mapmodule/plugin/layers/LayersPlugin",
	"bundles/framework/bundle/mapmodule-plugin/request/MapLayerVisibilityRequest",
	"../../request/MapLayerVisibilityRequestHandler",
	"../../request/MapMoveRequestHandler",
	"./ui/module/map-module",
	"bundles/framework/bundle/mapmodule-plugin/plugin/Plugin",
	"./plugin/controls/ControlsPlugin",
	"bundles/framework/bundle/mapmodule-plugin/request/DisableMapKeyboardMovementRequest",
	"bundles/framework/bundle/mapmodule-plugin/request/DisableMapMouseMovementRequest",
	"bundles/framework/bundle/mapmodule-plugin/request/EnableMapKeyboardMovementRequest",
	"bundles/framework/bundle/mapmodule-plugin/request/EnableMapMouseMovementRequest",
	"bundles/framework/bundle/mapmodule-plugin/request/MapMovementControlsRequestHandler",
	"src/oskari/base/request/common/show-map-measurement-request",
	"bundles/framework/bundle/mapmodule-plugin/request/MapMoveByLayerContentRequest",
	"bundles/framework/bundle/mapmodule-plugin/request/MapMoveByLayerContentRequestHandler",
	"bundles/framework/bundle/mapmodule-plugin/event/MapLayerVisibilityChangedEvent",

	/* WmsLayer */
	"./plugin/wmslayer/WmsLayerPlugin",

	/* WmtsLayer */
	"mapwmts",
	"./plugin/wmtslayer/WmtsLayerPlugin",
	"./plugin/wmtslayer/WmtsLayerModelBuilder",

	/* StatsLayer */
	"./plugin/statslayer/StatsLayerPlugin",
	"bundles/framework/bundle/mapstats/domain/StatsLayer",
	"bundles/framework/bundle/mapstats/domain/StatsLayerModelBuilder",
	"bundles/framework/bundle/mapstats/event/StatsVisualizationChangeEvent",
	"bundles/framework/bundle/mapstats/event/FeatureHighlightedEvent",
	"bundles/framework/bundle/mapstats/event/HoverTooltipContentEvent",
	"css!resources/framework/bundle/mapstats/css/mapstats.css",
	"bundles/framework/bundle/mapstats/locale/fi",
	"bundles/framework/bundle/mapstats/locale/sv",
	"bundles/framework/bundle/mapstats/locale/en",

	/* WFSLayer */
	"mapwfs2",

	"bundles/framework/bundle/mapmodule-plugin/request/ToolSelectionRequest",
	"bundles/framework/bundle/mapmodule-plugin/plugin/controls/ToolSelectionHandler",
	"bundles/framework/bundle/mapmodule-plugin/request/MapLayerUpdateRequest",
	"bundles/framework/bundle/mapmodule-plugin/request/MapLayerUpdateRequestHandler",
	"bundles/framework/bundle/mapmodule-plugin/event/MapClickedEvent",
	"bundles/framework/bundle/mapmodule-plugin/event/EscPressedEvent",
	"bundles/framework/bundle/mapmodule-plugin/plugin/zoombar/Portti2Zoombar",
	"css!resources/framework/bundle/mapmodule-plugin/plugin/portti2zoombar/css/porttizoombar.css",
	"../../plugin/panbuttons/PanButtons",
	"./plugin/panbuttons/PanButtons",
	"css!resources/framework/bundle/mapmodule-plugin/plugin/panbuttons/css/panbuttons.css",
	"css!resources/framework/bundle/mapmodule-plugin/css/mapmodule.css",
    "bundles/framework/bundle/mapmodule-plugin/locale/am",
    "bundles/framework/bundle/mapmodule-plugin/locale/bg",
    "bundles/framework/bundle/mapmodule-plugin/locale/cs",
    "bundles/framework/bundle/mapmodule-plugin/locale/da",
    "bundles/framework/bundle/mapmodule-plugin/locale/de",
    "bundles/framework/bundle/mapmodule-plugin/locale/en",
    "bundles/framework/bundle/mapmodule-plugin/locale/es",
    "bundles/framework/bundle/mapmodule-plugin/locale/et",
    "bundles/framework/bundle/mapmodule-plugin/locale/fi",
    "bundles/framework/bundle/mapmodule-plugin/locale/ge",
    "bundles/framework/bundle/mapmodule-plugin/locale/gr",
    "bundles/framework/bundle/mapmodule-plugin/locale/hr",
    "bundles/framework/bundle/mapmodule-plugin/locale/hu",
    "bundles/framework/bundle/mapmodule-plugin/locale/lv",
    "bundles/framework/bundle/mapmodule-plugin/locale/nl",
    "bundles/framework/bundle/mapmodule-plugin/locale/pl",
    "bundles/framework/bundle/mapmodule-plugin/locale/pt",
    "bundles/framework/bundle/mapmodule-plugin/locale/ro",
    "bundles/framework/bundle/mapmodule-plugin/locale/rs",
    "bundles/framework/bundle/mapmodule-plugin/locale/sl",
    "bundles/framework/bundle/mapmodule-plugin/locale/sk",
    "bundles/framework/bundle/mapmodule-plugin/locale/sq",
    "bundles/framework/bundle/mapmodule-plugin/locale/sv",
    "bundles/framework/bundle/mapmodule-plugin/locale/uk",
	"bundles/framework/bundle/mapfull/locale/fi",
	"bundles/framework/bundle/mapfull/locale/sv",
	"bundles/framework/bundle/mapfull/locale/en",
    "bundles/framework/bundle/divmanazer/locale/fi",
    "bundles/framework/bundle/divmanazer/locale/sv",
    "bundles/framework/bundle/divmanazer/locale/en",
    "bundles/framework/bundle/divmanazer/locale/cs",
    "bundles/framework/bundle/divmanazer/locale/de",
    "bundles/framework/bundle/divmanazer/locale/es",
    // Fix incompatible plugins before they are really required
	"src/framework/featuredata2/plugin/MapSelectionPlugin",
	"src/framework/printout/plugin/LegendPlugin",
	"src/catalogue/metadataflyout/plugin/MetadataLayerPlugin"
], function(Oskari, jQuery) {
	return Oskari.bundleCls("mapmodule-plugin").category({
		create: function() {
			return this;
		},
		update: function(manager, bundle, bi, info) {},
		start: function() {

		},
		stop: function() {

		}
	})
});