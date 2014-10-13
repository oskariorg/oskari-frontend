// This file needs to be manually updated based upon
// Oskari/packages/framework/bundle/mapmodule-plugin/bundle.js
// Last updated on 3.10.2014

define([
	"oskari",
	"jquery-ui",
	"src/oskari/base/module",
// Abstract base
	"../../AbstractMapModule",
	"../../plugin/AbstractMapModulePlugin",
	"../../plugin/BasicMapModulePlugin",
// map-module
	"bundles/framework/bundle/mapmodule-plugin/ui/module/map-module",
	"bundles/framework/bundle/mapmodule-plugin/plugin/Plugin",
// controls plugin
	"bundles/framework/bundle/mapmodule-plugin/plugin/controls/ControlsPlugin",
	"bundles/framework/bundle/mapmodule-plugin/plugin/controls/PorttiKeyboard",
	"bundles/framework/bundle/mapmodule-plugin/plugin/controls/OskariNavigation",
	"bundles/framework/bundle/mapmodule-plugin/plugin/controls/OskariPinchZoom",

	"bundles/framework/bundle/mapmodule-plugin/request/DisableMapKeyboardMovementRequest",
	"bundles/framework/bundle/mapmodule-plugin/request/DisableMapMouseMovementRequest",
	"bundles/framework/bundle/mapmodule-plugin/request/EnableMapKeyboardMovementRequest",
	"bundles/framework/bundle/mapmodule-plugin/request/EnableMapMouseMovementRequest",
	"bundles/framework/bundle/mapmodule-plugin/request/MapMovementControlsRequestHandler",

	"src/oskari/base/request/common/show-map-measurement-request",
// GFI
	"bundles/framework/bundle/mapmodule-plugin/plugin/getinfo/GetFeatureInfoHandler",
	"bundles/framework/bundle/mapmodule-plugin/request/GetFeatureInfoRequest",
	"bundles/framework/bundle/mapmodule-plugin/request/GetFeatureInfoActivationRequest",
	"bundles/framework/bundle/mapmodule-plugin/plugin/getinfo/GetInfoPlugin",
	"bundles/framework/bundle/mapmodule-plugin/plugin/getinfo/GetFeatureInfoFormatter",
	"css!resources/framework/bundle/mapmodule-plugin/plugin/getinfo/css/getinfo.css",
// Markers plugin
	"bundles/framework/bundle/mapmodule-plugin/plugin/markers/MarkersPlugin",
	"bundles/framework/bundle/mapmodule-plugin/request/AddMarkerRequest",
	"bundles/framework/bundle/mapmodule-plugin/request/AddMarkerRequestHandler",
	"bundles/framework/bundle/mapmodule-plugin/request/RemoveMarkersRequest",
	"bundles/framework/bundle/mapmodule-plugin/request/RemoveMarkersRequestHandler",
	"bundles/framework/bundle/mapmodule-plugin/event/AfterAddMarkerEvent",
	"bundles/framework/bundle/mapmodule-plugin/event/AfterRemoveMarkersEvent",
// search plugin
	"bundles/framework/bundle/mapmodule-plugin/plugin/search/SearchPlugin",
	"bundles/framework/bundle/search/service/searchservice",
	"css!resources/framework/bundle/mapmodule-plugin/plugin/search/css/search.css",
// logo plugin
	"bundles/framework/bundle/mapmodule-plugin/plugin/logo/LogoPlugin",
	"css!resources/framework/bundle/mapmodule-plugin/plugin/logo/css/logoplugin.css",
// data source plugin
	"bundles/framework/bundle/mapmodule-plugin/plugin/datasource/DataSourcePlugin",
	"css!resources/framework/bundle/mapmodule-plugin/plugin/datasource/css/datasource.css",
// indexmap
	"bundles/framework/bundle/mapmodule-plugin/plugin/indexmap/IndexMapPlugin",
	"css!resources/framework/bundle/mapmodule-plugin/plugin/indexmap/css/indexmap.css",
// scalebar
	"bundles/framework/bundle/mapmodule-plugin/plugin/scalebar/ScaleBarPlugin",
	"css!resources/framework/bundle/mapmodule-plugin/plugin/scalebar/css/scalebar.css",
// publishertoolbarplugin plugin
	"bundles/framework/bundle/mapmodule-plugin/plugin/publishertoolbar/PublisherToolbarPlugin",
	"css!resources/framework/bundle/mapmodule-plugin/plugin/publishertoolbar/css/publishertoolbar.css",
// fullscreen
	"bundles/framework/bundle/mapmodule-plugin/plugin/fullscreen/FullScreen",
	"css!resources/framework/bundle/mapmodule-plugin/plugin/fullscreen/css/fullscreen.css",
// maplayer selection plugin
	"bundles/framework/bundle/mapmodule-plugin/plugin/layers/LayerSelectionPlugin",
	"css!resources/framework/bundle/mapmodule-plugin/plugin/layers/css/layersselection.css",
// background maplayer selection plugin
	"bundles/framework/bundle/mapmodule-plugin/plugin/layers/BackgroundLayerSelectionPlugin",
	"css!resources/framework/bundle/mapmodule-plugin/plugin/layers/css/backgroundlayerselection.css",
// layers plugin
	"bundles/framework/bundle/mapmodule-plugin/plugin/layers/LayersPlugin",
	"bundles/framework/bundle/mapmodule-plugin/request/MapLayerVisibilityRequest",
	"bundles/framework/bundle/mapmodule-plugin/request/MapLayerVisibilityRequestHandler",
	"bundles/framework/bundle/mapmodule-plugin/request/MapMoveByLayerContentRequest",
	"bundles/framework/bundle/mapmodule-plugin/request/MapMoveByLayerContentRequestHandler",
	"bundles/framework/bundle/mapmodule-plugin/event/MapLayerVisibilityChangedEvent",
// layers backport
	"./plugin/wmslayer/WmsLayerPlugin",
	"mapwmts",
	"mapwfs2",
	"mapstats",
	"bundles/framework/bundle/mapmodule-plugin/plugin/vectorlayer/VectorLayerPlugin",
	"bundles/framework/bundle/mapmodule-plugin/plugin/location/GeoLocationPlugin",
// draw plugin
	"bundles/framework/bundle/mapmodule-plugin/plugin/drawplugin/DrawPlugin",
	"bundles/framework/bundle/mapmodule-plugin/plugin/drawplugin/event/AddedFeatureEvent",
	"bundles/framework/bundle/mapmodule-plugin/plugin/drawplugin/event/FinishedDrawingEvent",
	"bundles/framework/bundle/mapmodule-plugin/plugin/drawplugin/event/SelectedDrawingEvent",
	"bundles/framework/bundle/mapmodule-plugin/plugin/drawplugin/event/ActiveDrawingEvent",
	"bundles/framework/bundle/mapmodule-plugin/plugin/drawplugin/request/GetGeometryRequest",
	"bundles/framework/bundle/mapmodule-plugin/plugin/drawplugin/request/GetGeometryRequestHandler",
	"bundles/framework/bundle/mapmodule-plugin/plugin/drawplugin/request/StartDrawingRequest",
	"bundles/framework/bundle/mapmodule-plugin/plugin/drawplugin/request/StartDrawingRequestHandler",
	"bundles/framework/bundle/mapmodule-plugin/plugin/drawplugin/request/StopDrawingRequest",
	"bundles/framework/bundle/mapmodule-plugin/plugin/drawplugin/request/StopDrawingRequestHandler",
// publishertoolbar plugin
	"bundles/framework/bundle/mapmodule-plugin/plugin/publishertoolbar/PublisherToolbarPlugin",
	"bundles/framework/bundle/mapmodule-plugin/plugin/publishertoolbar/request/ToolContainerRequest",
	"bundles/framework/bundle/mapmodule-plugin/plugin/publishertoolbar/request/ToolContainerRequestHandler",
	"css!resources/framework/bundle/mapmodule-plugin/plugin/publishertoolbar/css/publishertoolbar.css",
// realtime plugin
    "bundles/framework/bundle/mapmodule-plugin/plugin/realtime/RealtimePlugin",
    "bundles/framework/bundle/mapmodule-plugin/plugin/realtime/event/RefreshLayerEvent",
// requests & handlers
	"bundles/framework/bundle/mapmodule-plugin/request/ToolSelectionRequest",
	"bundles/framework/bundle/mapmodule-plugin/plugin/controls/ToolSelectionHandler",
	"bundles/framework/bundle/mapmodule-plugin/request/MapLayerUpdateRequest",
	"bundles/framework/bundle/mapmodule-plugin/request/MapLayerUpdateRequestHandler",
	"bundles/framework/bundle/mapmodule-plugin/request/MapMoveRequestHandler",
	"bundles/framework/bundle/mapmodule-plugin/event/MapClickedEvent",
	"bundles/framework/bundle/mapmodule-plugin/event/EscPressedEvent",
	"bundles/framework/bundle/mapmodule-plugin/event/GetInfoResultEvent",
	"bundles/framework/bundle/mapmodule-plugin/event/MapSizeChangedEvent",
	"bundles/framework/bundle/mapmodule-plugin/plugin/zoombar/Portti2Zoombar",
	"css!resources/framework/bundle/mapmodule-plugin/plugin/zoombar/css/porttizoombar.css",
	"../../AbstractMapLayerPlugin",
	"./plugin/panbuttons/PanButtons",
	"css!resources/framework/bundle/mapmodule-plugin/plugin/panbuttons/css/panbuttons.css",
	"css!resources/framework/bundle/mapmodule-plugin/css/mapmodule.css",
    "bundles/framework/bundle/mapmodule-plugin/locale/bg",
    "bundles/framework/bundle/mapmodule-plugin/locale/cs",
    "bundles/framework/bundle/mapmodule-plugin/locale/da",
    "bundles/framework/bundle/mapmodule-plugin/locale/de",
    "bundles/framework/bundle/mapmodule-plugin/locale/el",
    "bundles/framework/bundle/mapmodule-plugin/locale/en",
    "bundles/framework/bundle/mapmodule-plugin/locale/es",
    "bundles/framework/bundle/mapmodule-plugin/locale/et",
    "bundles/framework/bundle/mapmodule-plugin/locale/fi",
    "bundles/framework/bundle/mapmodule-plugin/locale/hr",
    "bundles/framework/bundle/mapmodule-plugin/locale/hu",
    "bundles/framework/bundle/mapmodule-plugin/locale/hy",
    "bundles/framework/bundle/mapmodule-plugin/locale/ka",
    "bundles/framework/bundle/mapmodule-plugin/locale/lv",
    "bundles/framework/bundle/mapmodule-plugin/locale/nl",
    "bundles/framework/bundle/mapmodule-plugin/locale/pl",
    "bundles/framework/bundle/mapmodule-plugin/locale/pt",
    "bundles/framework/bundle/mapmodule-plugin/locale/ro",
    "bundles/framework/bundle/mapmodule-plugin/locale/sk",
    "bundles/framework/bundle/mapmodule-plugin/locale/sl",
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
	"bundles/catalogue/bundle/metadataflyout/plugin/MetadataLayerPlugin"
],
function(Oskari, jQuery) {
	return Oskari.bundleCls("mapmodule-plugin").category({
		create: function() {
			return this;
		},
		update: function(manager, bundle, bi, info) {
			manager.alert("RECEIVED update notification " + info);
		}
	})
});