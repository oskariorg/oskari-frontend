/**
 * @class Oskari.mapframework.bundle.PluginMapModuleBundle
 */
Oskari.clazz.define("Oskari.mapframework.bundle.PluginMapModuleBundle", function() {
	this.singleton = null;
}, {
	/*
	 * implementation for protocol 'Oskari.bundle.Bundle'
	 */
	"create" : function() {

		if(!this.singleton) {
			this.singleton = Oskari.clazz.create("Oskari.mapframework.bundle.PluginMapModuleBundleInstance");

		}
		return this.singleton;
	},
	"update" : function(manager, bundle, bi, info) {
		manager.alert("RECEIVED update notification " + info);
	}
},

/**
 * metadata
 */
{

	"protocol" : ["Oskari.bundle.Bundle", "Oskari.mapframework.bundle.extension.ExtensionBundle"],
	"source" : {

		"scripts" : [
		/*
		 * map-module
		 */
		{
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/mapmodule-plugin/ui/module/map-module.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/Plugin.js"
		},
		/**
		 * controls plugin
		 */
		{
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/controls/ControlsPlugin.js"
        },
		{
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/controls/PorttiKeyboard.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/controls/PorttiZoomBar.js"
		},{
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/controls/PorttiDragPan.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/controls/PorttiDrag.js"
		},{
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/controls/PorttiMouse.js"
        },  {
            "type" : "text/javascript",
            "src" : "../../../../sources/framework/request/common/show-map-measurement-request.js"
        }, 
		/**
		 *
		 */
		{
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/getinfo/GetInfoAdapter.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/getinfo/GetFeatureInfoHandler.js"
        }, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/getinfo/GetInfoPlugin.js"
		},
		/**
		 * 	sketch layer plugin
		 */
		{
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/sketchlayer/SketchLayerPlugin.js"
		},
		/**
		 * Markers plugin
		 */
		{
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/markers/MarkersPlugin.js"
		},
        /**
         * Search plugin
         */
        {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/search/SearchPlugin.js"
        },
        {
            "type" : "text/css",
            "src" : "../../../../resources/framework/bundle/mapmodule-plugin/plugin/search/css/search.css"
        },
        /**
         * Logo plugin
         */
        {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/logo/LogoPlugin.js"
        },
        {
            "type" : "text/css",
            "src" : "../../../../resources/framework/bundle/mapmodule-plugin/plugin/logo/css/logoplugin.css"
        },
        
        // IndexMap
        {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/indexmap/IndexMapPlugin.js"
        },
        {
            "type" : "text/css",
            "src" : "../../../../resources/framework/bundle/mapmodule-plugin/plugin/indexmap/css/indexmap.css"
        },
        
        // ScaleBar
        {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/scalebar/ScaleBarPlugin.js"
        },
        
        /**
         * MapLayer plugin
         */
        {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/layers/LayerSelectionPlugin.js"
        },
		/**
		 * Layers plugin
		 */
		{
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/layers/LayersPlugin.js"
		},
		{
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/mapmodule-plugin/request/MapLayerVisibilityRequest.js"
		},
		{
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/mapmodule-plugin/request/MapLayerVisibilityRequestHandler.js"
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
			"src" : "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/wmslayer/WmsLayerPlugin.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/wmslayer/SnappyGrid.js"
		},
		/**
		 * WFS plugin
		 */
		{
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/wfslayer/WfsLayerPlugin.js"
		},
		/**
		 * Vector Layer plugin
		 */
		{
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/vectorlayer/VectorLayerPlugin.js"
		},
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
			"src" : "../../../../bundles/framework/bundle/mapmodule-plugin/request/MapMoveRequestHandler.js"
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
		    "src" : "../../../../resources/framework/bundle/" + 
		            "mapmodule-plugin/plugin/portti2zoombar/css/porttizoombar.css"	  
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/panbuttons/PanButtons.js"
		},{
		    "type" : "text/css",
		    "src" : "../../../../resources/framework/bundle/" + 
		            "mapmodule-plugin/plugin/panbuttons/css/panbuttons.css"	  
		},{
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/mapmodule-plugin/instance.js"
		},
		{
            "type" : "text/css",
            "src" : "../../../../resources/framework/bundle/mapmodule-plugin/css/mapmodule.css"
        }],
		"locales" : [{
			"lang" : "fi",
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/mapmodule-plugin/locale/fi.js"
		}, {
			"lang" : "sv",
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/mapmodule-plugin/locale/sv.js"
		}, {
			"lang" : "en",
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
Oskari.bundle_manager.installBundleClass("mapmodule-plugin", "Oskari.mapframework.bundle.PluginMapModuleBundle");
