define(["oskari", "jquery", 
"_bundles_/framework/bundle/oskariui/module",
"_bundles_/oskari/bundle/map-openlayers/module",
"_bundles_/oskari/platform/module",
"_bundles_/framework/bundle/mapmodule-plugin/ui/module/map-module",
			"_bundles_/framework/bundle/mapmodule-plugin/plugin/Plugin",            
            "_bundles_/framework/bundle/mapmodule-plugin/plugin/controls/ControlsPlugin",			
			"_bundles_/framework/bundle/mapmodule-plugin/plugin/controls/PorttiKeyboard",
            "_bundles_/framework/bundle/mapmodule-plugin/plugin/controls/PorttiMouse",
            "_bundles_/framework/bundle/mapmodule-plugin/request/DisableMapKeyboardMovementRequest",
            "_bundles_/framework/bundle/mapmodule-plugin/request/DisableMapMouseMovementRequest",
            "_bundles_/framework/bundle/mapmodule-plugin/request/EnableMapKeyboardMovementRequest",
            "_bundles_/framework/bundle/mapmodule-plugin/request/EnableMapMouseMovementRequest",
            "_bundles_/framework/bundle/mapmodule-plugin/request/MapMovementControlsRequestHandler",
            "_bundles_/framework/bundle/mapmodule-plugin/plugin/getinfo/GetFeatureInfoHandler",
            "_bundles_/framework/bundle/mapmodule-plugin/request/GetFeatureInfoRequest",
            "_bundles_/framework/bundle/mapmodule-plugin/request/GetFeatureInfoActivationRequest",
			"_bundles_/framework/bundle/mapmodule-plugin/plugin/getinfo/GetInfoPlugin",
            "css!_resources_/framework/bundle/mapmodule-plugin/plugin/getinfo/css/getinfo.css",	
			"_bundles_/framework/bundle/mapmodule-plugin/plugin/markers/MarkersPlugin",   
            "_bundles_/framework/bundle/mapmodule-plugin/request/RemoveMarkerRequest",   
            "_bundles_/framework/bundle/mapmodule-plugin/request/MarkerRequestHandler",   
            "_bundles_/framework/bundle/mapmodule-plugin/plugin/search/SearchPlugin",   
            "_bundles_/framework/bundle/search/service/searchservice",
            "css!_resources_/framework/bundle/mapmodule-plugin/plugin/search/css/search.css",            
            "_bundles_/framework/bundle/mapmodule-plugin/plugin/logo/LogoPlugin",
            "css!_resources_/framework/bundle/mapmodule-plugin/plugin/logo/css/logoplugin.css",            
            "_bundles_/framework/bundle/mapmodule-plugin/plugin/datasource/DataSourcePlugin",
            "css!_resources_/framework/bundle/mapmodule-plugin/plugin/datasource/css/datasource.css",            
            "_bundles_/framework/bundle/mapmodule-plugin/plugin/indexmap/IndexMapPlugin",
            "css!_resources_/framework/bundle/mapmodule-plugin/plugin/indexmap/css/indexmap.css",    
            "_bundles_/framework/bundle/mapmodule-plugin/plugin/scalebar/ScaleBarPlugin",
            "_bundles_/framework/bundle/mapmodule-plugin/plugin/fullscreen/FullScreen",
            "css!_resources_/framework/bundle/mapmodule-plugin/plugin/fullscreen/css/fullscreen.css",
                "_bundles_/framework/bundle/mapmodule-plugin/plugin/layers/LayerSelectionPlugin",
            "css!_resources_/framework/bundle/mapmodule-plugin/plugin/layers/css/layersselection.css",
            	"_bundles_/framework/bundle/mapmodule-plugin/plugin/layers/LayersPlugin",
			"_bundles_/framework/bundle/mapmodule-plugin/request/MapLayerVisibilityRequest",
			"_bundles_/framework/bundle/mapmodule-plugin/request/MapLayerVisibilityRequestHandler",
			"_bundles_/framework/bundle/mapmodule-plugin/request/MapMoveByLayerContentRequest",
			"_bundles_/framework/bundle/mapmodule-plugin/request/MapMoveByLayerContentRequestHandler",
			"_bundles_/framework/bundle/mapmodule-plugin/event/MapLayerVisibilityChangedEvent",
			"_bundles_/framework/bundle/mapmodule-plugin/plugin/wmslayer/WmsLayerPlugin",
			"_bundles_/framework/bundle/mapmodule-plugin/plugin/vectorlayer/VectorLayerPlugin",
            "_bundles_/framework/bundle/mapmodule-plugin/plugin/location/GeoLocationPlugin",
			"_bundles_/framework/bundle/mapmodule-plugin/request/ToolSelectionRequest",
			"_bundles_/framework/bundle/mapmodule-plugin/plugin/controls/ToolSelectionHandler",
			"_bundles_/framework/bundle/mapmodule-plugin/request/MapLayerUpdateRequest",
			"_bundles_/framework/bundle/mapmodule-plugin/request/MapLayerUpdateRequestHandler",
			"_bundles_/framework/bundle/mapmodule-plugin/request/MapMoveRequestHandler",
			"_bundles_/framework/bundle/mapmodule-plugin/event/MapClickedEvent",
			"_bundles_/framework/bundle/mapmodule-plugin/event/EscPressedEvent",
			"_bundles_/framework/bundle/mapmodule-plugin/request/ClearHistoryRequest",
			"_bundles_/framework/bundle/mapmodule-plugin/plugin/controls/ClearHistoryHandler",
			"_bundles_/framework/bundle/mapmodule-plugin/plugin/zoombar/Portti2Zoombar",
		    "css!_resources_/framework/bundle/mapmodule-plugin/plugin/portti2zoombar/css/porttizoombar.css",	  
			"_bundles_/framework/bundle/mapmodule-plugin/plugin/panbuttons/PanButtons",
		    "css!_resources_/framework/bundle/mapmodule-plugin/plugin/panbuttons/css/panbuttons.css",	  
            "css!_resources_/framework/bundle/mapmodule-plugin/css/mapmodule.css",
			"_bundles_/framework/bundle/mapmodule-plugin/locale/fi",
			"_bundles_/framework/bundle/mapmodule-plugin/locale/sv",
			"_bundles_/framework/bundle/mapmodule-plugin/locale/en",
			/* mapfull */

	"./instance",
	"./enhancement/start-map-with-link-enhancement",
	"./request/MapResizeEnabledRequest",
	"./request/MapResizeEnabledRequestHandler",
	"./request/MapWindowFullScreenRequest",
	"./request/MapWindowFullScreenRequestHandler",
	"css!_resources_/framework/bundle/mapfull/css/style.css"

], function(Oskari, jQuery) {
	
	
	Oskari.bundleCls('oskariui');
	Oskari.bundleCls('openlayers-default-theme');
	
	Oskari.bundleCls('mapmodule-plugin');
		
	return Oskari.bundleCls('mapfull').category({
		create : function() {
			return Oskari.cls("Oskari.mapframework.bundle.mapfull.MapFullBundleInstance").create();
		}
	});

});