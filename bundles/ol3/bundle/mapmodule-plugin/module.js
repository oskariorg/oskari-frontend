define([
	"oskari",
	"jquery",
    "bundles/oskari/platform/module",
	"../../../mapping/bundle/mapmodule-plugin/map-module",
	"../../../mapping/bundle/mapmodule-plugin/plugin/MapPlugin",
	"../../../mapping/bundle/mapmodule-plugin/plugin/MapLayerPlugin",
	"../../../mapping/bundle/mapmodule-plugin/plugin/panbuttons/PanButtons",
	"../../../mapping/bundle/mapmodule-plugin/plugin/layers/LayersPlugin",
	"../../../framework/bundle/mapmodule-plugin/request/MapLayerVisibilityRequest",
	"../../../mapping/bundle/mapmodule-plugin/request/MapLayerVisibilityRequestHandler",
	"../../../mapping/bundle/mapmodule-plugin/request/MapMoveRequestHandler",
	"./ui/module/map-module",
	"../../../framework/bundle/mapmodule-plugin/plugin/Plugin",
	"./plugin/controls/ControlsPlugin",
	"../../../framework/bundle/mapmodule-plugin/request/DisableMapKeyboardMovementRequest",
	"../../../framework/bundle/mapmodule-plugin/request/DisableMapMouseMovementRequest",
	"../../../framework/bundle/mapmodule-plugin/request/EnableMapKeyboardMovementRequest",
	"../../../framework/bundle/mapmodule-plugin/request/EnableMapMouseMovementRequest",
	"../../../framework/bundle/mapmodule-plugin/request/MapMovementControlsRequestHandler",
	"../../../../sources/framework/request/common/show-map-measurement-request",
	"../../../framework/bundle/mapmodule-plugin/request/MapMoveByLayerContentRequest",
	"../../../framework/bundle/mapmodule-plugin/request/MapMoveByLayerContentRequestHandler",
	"../../../framework/bundle/mapmodule-plugin/event/MapLayerVisibilityChangedEvent",
	"./plugin/wmslayer/WmsLayerPlugin",
	"./plugin/wmtslayer/WmtsLayerPlugin",
	"./plugin/wmtslayer/WmtsLayer",
	"./plugin/wmtslayer/WmtsLayerModelBuilder",
	"../../../framework/bundle/mapmodule-plugin/request/ToolSelectionRequest",
	"../../../framework/bundle/mapmodule-plugin/plugin/controls/ToolSelectionHandler",
	"../../../framework/bundle/mapmodule-plugin/request/MapLayerUpdateRequest",
	"../../../framework/bundle/mapmodule-plugin/request/MapLayerUpdateRequestHandler",
	"../../../framework/bundle/mapmodule-plugin/event/MapClickedEvent",
	"../../../framework/bundle/mapmodule-plugin/event/EscPressedEvent",
	"../../../framework/bundle/mapmodule-plugin/request/ClearHistoryRequest",
	"../../../framework/bundle/mapmodule-plugin/plugin/controls/ClearHistoryHandler",
	"../../../framework/bundle/mapmodule-plugin/plugin/zoombar/Portti2Zoombar",
	"css!resources/framework/bundle/mapmodule-plugin/plugin/portti2zoombar/css/porttizoombar.css",
	"./plugin/panbuttons/PanButtons",
	"css!resources/framework/bundle/mapmodule-plugin/plugin/panbuttons/css/panbuttons.css",
	"css!resources/framework/bundle/mapmodule-plugin/css/mapmodule.css",
	"../../../framework/bundle/mapmodule-plugin/locale/fi",
	"../../../framework/bundle/mapmodule-plugin/locale/sv",
	"../../../framework/bundle/mapmodule-plugin/locale/en"
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