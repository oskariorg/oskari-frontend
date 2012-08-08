/**
 * @class Oskari.mapframework.bundle.MyPlacesBundle
 */
Oskari.clazz.define("Oskari.mapframework.bundle.MyPlacesBundle", function() {
}, {
	/*
	 * implementation for protocol 'Oskari.bundle.Bundle'
	 */
	"create" : function() {

		return Oskari.clazz.create("Oskari.mapframework.bundle.MyPlacesBundleInstance");
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

		"scripts" : [{
			"type" : "text/css",
			"src" : "../../../../resources/framework/bundle/myplaces/css/myplaces.css"
		},

		/* event */
		{
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/myplaces/event/FinishedDrawingEvent.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/myplaces/event/MyPlaceHoverEvent.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/myplaces/event/MyPlacesChangedEvent.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/myplaces/event/MyPlaceSelectedEvent.js"
		},
		/* model */
		{
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/myplaces/model/MyPlace.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/myplaces/model/MyPlacesCategory.js"
		},
		/* plugin */
		{
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/myplaces/plugin/myplacesdraw/DrawPlugin.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/myplaces/plugin/myplacesdraw/GetGeometryRequestHandler.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/myplaces/plugin/myplacesdraw/StartDrawingRequestHandler.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/myplaces/plugin/myplacesdraw/StopDrawingRequestHandler.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/myplaces/plugin/myplaceshover/HoverPlugin.js"
		},
		/* request */
		{
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/myplaces/request/StopDrawingRequest.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/myplaces/request/StartDrawingRequest.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/myplaces/request/GetGeometryRequest.js"
		},
		/* service */
		{
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/myplaces/service/MyPlacesService.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/myplaces/service/MyPlacesWFSTStore.js"
		},
		/* ui */
		{
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/myplaces/ui/module/myplaces-module.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/myplaces/ui/module/myplaces-locale.js"
		},
		/* ui view */
		{
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/myplaces/ui/view/CategoryPanel.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/myplaces/ui/view/ConfirmWindow.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/myplaces/ui/view/MyPlacePanel.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/myplaces/ui/view/MyPlacesBasicControls.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/myplaces/ui/view/MyPlacesDrawControls.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/myplaces/ui/view/MyPlacesGrid.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/myplaces/ui/view/MyPlacesGridPanel.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/myplaces/ui/view/MyPlacesMainPanel.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/myplaces/ui/view/MyPlacesWizard.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/myplaces/ui/view/MyPlacesPlaceSelectedControls.js"
		}, {
			"type" : "text/javascript",
			"src" : "instance.js"
		}],
		"resources" : []
	},
	"bundle" : {
		"manifest" : {
			"Bundle-Identifier" : "myplaces",
			"Bundle-Name" : "myplaces",
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
					"Name" : "OmatPaikat",
					"Title" : "Omat Paikat"
				},
				"en" : {}
			},
			"Bundle-Version" : "1.0.0",
			"Import-Namespace" : ["Oskari", "Ext"]
		}
	}
});

/**
 * Install this bundle
 */
Oskari.bundle_manager.installBundleClass("myplaces", "Oskari.mapframework.bundle.MyPlacesBundle");
