define([
	"src/oskari/oskari",
	"jquery",
	"src/oskari/base/module",
	"../../mapping/mapmodule-plugin/map-module",
	"../../mapping/mapmodule-plugin/plugin/MapPlugin",
	"../../mapping/mapmodule-plugin/plugin/MapLayerPlugin",
	"../../mapping/mapmodule-plugin/plugin/panbuttons/PanButtons",
	"../../mapping/mapmodule-plugin/plugin/layers/LayersPlugin",
	"bundles/framework/bundle/mapmodule-plugin/request/MapLayerVisibilityRequest",
	"../../mapping/mapmodule-plugin/request/MapLayerVisibilityRequestHandler",
	"../../mapping/mapmodule-plugin/request/MapMoveRequestHandler",
	"./ui/module/map-module",
	"bundles/framework/bundle/mapmodule-plugin/plugin/Plugin",
	"./plugin/controls/ControlsPlugin",
	"bundles/framework/bundle/mapmodule-plugin/request/DisableMapKeyboardMovementRequest",
	"bundles/framework/bundle/mapmodule-plugin/request/DisableMapMouseMovementRequest",
	"bundles/framework/bundle/mapmodule-plugin/request/EnableMapKeyboardMovementRequest",
	"bundles/framework/bundle/mapmodule-plugin/request/EnableMapMouseMovementRequest",
	"bundles/framework/bundle/mapmodule-plugin/request/MapMovementControlsRequestHandler",
	"../../../sources/framework/request/common/show-map-measurement-request",
	"bundles/framework/bundle/mapmodule-plugin/request/MapMoveByLayerContentRequest",
	"bundles/framework/bundle/mapmodule-plugin/request/MapMoveByLayerContentRequestHandler",
	"bundles/framework/bundle/mapmodule-plugin/event/MapLayerVisibilityChangedEvent",
	"./plugin/wmslayer/WmsLayerPlugin",
	"./plugin/wmtslayer/WmtsLayerPlugin",
	"./plugin/wmtslayer/WmtsLayer",
	"./plugin/wmtslayer/WmtsLayerModelBuilder",
	"bundles/framework/bundle/mapmodule-plugin/request/ToolSelectionRequest",
	"bundles/framework/bundle/mapmodule-plugin/plugin/controls/ToolSelectionHandler",
	"bundles/framework/bundle/mapmodule-plugin/request/MapLayerUpdateRequest",
	"bundles/framework/bundle/mapmodule-plugin/request/MapLayerUpdateRequestHandler",
	"bundles/framework/bundle/mapmodule-plugin/event/MapClickedEvent",
	"bundles/framework/bundle/mapmodule-plugin/event/EscPressedEvent",
	"bundles/framework/bundle/mapmodule-plugin/request/ClearHistoryRequest",
	"bundles/framework/bundle/mapmodule-plugin/plugin/controls/ClearHistoryHandler",
	"bundles/framework/bundle/mapmodule-plugin/plugin/zoombar/Portti2Zoombar",
	"css!resources/framework/bundle/mapmodule-plugin/plugin/portti2zoombar/css/porttizoombar.css",
	"./plugin/panbuttons/PanButtons",
	"css!resources/framework/bundle/mapmodule-plugin/plugin/panbuttons/css/panbuttons.css",
	"css!resources/framework/bundle/mapmodule-plugin/css/mapmodule.css",
	"bundles/framework/bundle/mapmodule-plugin/locale/fi",
	"bundles/framework/bundle/mapmodule-plugin/locale/sv",
	"bundles/framework/bundle/mapmodule-plugin/locale/en"
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