/**
 * @class Oskari.mapframework.bundle.PluginMapModuleBundle
 */
Oskari.clazz.define("Oskari.ol3.bundle.MapModulePluginBundle", function() {
}, {
	/*
	 * implementation for protocol 'Oskari.bundle.Bundle'
	 */
	"create" : function() {
		return this;
	},
	"update" : function(manager, bundle, bi, info) {		
	},
	"start" : function() {
		
	},
	"stop" : function() {
		
	}
	
},

/**
 * metadata
 */
{

	"protocol" : ["Oskari.bundle.Bundle", "Oskari.mapframework.bundle.extension.ExtensionBundle"],
	"source" : {

		"scripts" : [
		{
            "type" : "text/javascript",
            "src" : "../../../../bundles/mapping/bundle/mapmodule-plugin/map-module.js"
        },
        {
            "type" : "text/javascript",
            "src" : "../../../../bundles/mapping/bundle/mapmodule-plugin/plugin/MapPlugin.js"
        },
        {
            "type" : "text/javascript",
            "src" : "../../../../bundles/mapping/bundle/mapmodule-plugin/plugin/MapLayerPlugin.js"
        }, 
        {
            "type" : "text/javascript",
            "src" : "../../../../bundles/mapping/bundle/mapmodule-plugin/plugin/panbuttons/PanButtons.js"
        },
        {
            "type" : "text/javascript",
            "src" : "../../../../bundles/mapping/bundle/mapmodule-plugin/plugin/layers/LayersPlugin.js"
        }, 
        {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/mapmodule-plugin/request/MapLayerVisibilityRequest.js"
        },
        {
            "type" : "text/javascript",
            "src" : "../../../../bundles/mapping/bundle/mapmodule-plugin/request/MapLayerVisibilityRequestHandler.js"
        },{
            "type" : "text/javascript",
            "src" : "../../../../bundles/mapping/bundle/mapmodule-plugin/request/MapMoveRequestHandler.js"
        },
		
		{
			"type" : "text/javascript",
			"src" : "../../../../bundles/ol3/bundle/mapmodule-plugin/ui/module/map-module.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/Plugin.js"
		},
		/**
		 * controls plugin
		 */
		{
            "type" : "text/javascript",
            "src" : "../../../../bundles/ol3/bundle/mapmodule-plugin/plugin/controls/ControlsPlugin.js"
        },
		/*{
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/controls/PorttiKeyboard.js"
		}, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/controls/PorttiMouse.js"
        }, */ {
            
            
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/mapmodule-plugin/request/DisableMapKeyboardMovementRequest.js"
        },  {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/mapmodule-plugin/request/DisableMapMouseMovementRequest.js"
        },  {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/mapmodule-plugin/request/EnableMapKeyboardMovementRequest.js"
        },  {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/mapmodule-plugin/request/EnableMapMouseMovementRequest.js"
        },  {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/mapmodule-plugin/request/MapMovementControlsRequestHandler.js"
        },  {
            
            
            "type" : "text/javascript",
            "src" : "../../../../sources/framework/request/common/show-map-measurement-request.js"
        }, 
	
		{
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/mapmodule-plugin/request/MapMoveByLayerContentRequest.js"
		},
		{
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/mapmodule-plugin/request/MapMoveByLayerContentRequestHandler.js"
		},
		{
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/mapmodule-plugin/event/MapLayerVisibilityChangedEvent.js"
		},
		
		/** Layers backport */
		{
			"type" : "text/javascript",
			"src" : "../../../../bundles/ol3/bundle/mapmodule-plugin/plugin/wmslayer/WmsLayerPlugin.js"
		},
		{
			"type" : "text/javascript",
			"src" : "../../../../bundles/ol3/bundle/mapmodule-plugin/plugin/wmtslayer/WmtsLayerPlugin.js"
		},		
		{
			"type" : "text/javascript",
			"src" : "../../../../bundles/ol3/bundle/mapmodule-plugin/plugin/wmtslayer//WmtsLayer.js"
		},
		{
			"type" : "text/javascript",
			"src" : "../../../../bundles/ol3/bundle/mapmodule-plugin/plugin/wmtslayer/WmtsLayerModelBuilder.js"
		},
		
		/**
		 * Vector Layer plugin
		 */
		/*{
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/vectorlayer/VectorLayerPlugin.js"
		},*/
        /**
         * GeoLocation plugin
         */
        /*{
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/location/GeoLocationPlugin.js"
        },*/
		
		/**
		 * Requests & handlers
		 */
		{
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/mapmodule-plugin/request/ToolSelectionRequest.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/controls/ToolSelectionHandler.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/mapmodule-plugin/request/MapLayerUpdateRequest.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/mapmodule-plugin/request/MapLayerUpdateRequestHandler.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/mapmodule-plugin/event/MapClickedEvent.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/mapmodule-plugin/event/EscPressedEvent.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/mapmodule-plugin/request/ClearHistoryRequest.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/controls/ClearHistoryHandler.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/zoombar/Portti2Zoombar.js"
		}, {
		    "type" : "text/css",
		    "src" : "../../../../resources/framework/bundle/mapmodule-plugin/plugin/portti2zoombar/css/porttizoombar.css"	  
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/ol3/bundle/mapmodule-plugin/plugin/panbuttons/PanButtons.js"
		},{
		    "type" : "text/css",
		    "src" : "../../../../resources/framework/bundle/mapmodule-plugin/plugin/panbuttons/css/panbuttons.css"	  
		},
		{
            "type" : "text/css",
            "src" : "../../../../resources/framework/bundle/mapmodule-plugin/css/mapmodule.css"
        }],
		"locales" : [{
		    // when lang is undefined, loader loads each language file, publisher needs localization for each 
			//"lang" : "fi",
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/mapmodule-plugin/locale/fi.js"
		}, {
			//"lang" : "sv",
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/mapmodule-plugin/locale/sv.js"
		}, {
			//"lang" : "en",
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/mapmodule-plugin/locale/en.js"
		}]
	},
	"bundle" : {
		"manifest" : {
			"Bundle-Identifier" : "mapmodule-plugin",
			"Bundle-Name" : "mapmodule",
			"Bundle-Tag" : {
				"mapframework" : true
			},

			"Bundle-Icon" : {
				"href" : "icon.png"
			},
			"Bundle-Author" : [{
				"Name" : "jjk",
				"Organisation" : "nls.fi",
				"Temporal" : {
					"Start" : "2009",
					"End" : "2011"
				},
				"Copyleft" : {
					"License" : {
						"License-Name" : "EUPL",
						"License-Online-Resource" : "http://www.paikkatietoikkuna.fi/license"
					}
				}
			}],
			"Bundle-Name-Locale" : {
				"fi" : {
					"Name" : "Kartta",
					"Title" : "Kartta"
				},
				"en" : {}
			},
			"Bundle-Version" : "1.0.0",
			"Import-Namespace" : ["Oskari", "Ext", "OpenLayers"]
		}
	}
});

/**
 * Install this bundle
 */
Oskari.bundle_manager.installBundleClass("mapmodule-plugin", "Oskari.ol3.bundle.MapModulePluginBundle");
