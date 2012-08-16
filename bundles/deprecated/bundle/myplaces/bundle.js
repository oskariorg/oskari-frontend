
/**
 * Bundle
 */
Oskari.clazz
		.define(

				"Oskari.mapframework.bundle.MyPlacesBundle",

				function() {
				},

				{
					/*
					 * implementation for protocol 'Oskari.bundle.Bundle'
					 */
					"create" : function() {

						return Oskari.clazz
								.create("Oskari.mapframework.bundle.MyPlacesBundleInstance");
					},

					"update" : function(manager, bundle, bi, info) {
						manager.alert("RECEIVED update notification " + info);
					}

				},

				/**
				 * metadata
				 */
				{

					"protocol" : [ "Oskari.bundle.Bundle",
							"Oskari.mapframework.bundle.extension.ExtensionBundle" ],
					"source" : {

						"scripts" : [{
							"type" : "text/javascript",
							"src" : "instance.js"
						},
								{
									"type" : "text/javascript",
									"src" : "event/FinishedDrawingEvent.js"
								},
								{
									"type" : "text/javascript",
									"src" : "event/MyPlaceSelectedEvent.js"
								},
								{
									"type" : "text/javascript",
									"src" : "event/MyPlaceHoverEvent.js"
								},
								{
									"type" : "text/javascript",
									"src" : "event/MyPlacesChangedEvent.js"
								},
								{
									"type" : "text/javascript",
									"src" : "model/MyPlace.js"
								},
								{
									"type" : "text/javascript",
									"src" : "model/MyPlacesCategory.js"
								},
								{
									"type" : "text/javascript",
									"src" : "plugin/myplacesdraw/DrawPlugin.js"
								},
								{
									"type" : "text/javascript",
									"src" : "plugin/myplacesdraw/StartDrawingRequestHandler.js"
								},
								{
									"type" : "text/javascript",
									"src" : "plugin/myplacesdraw/StopDrawingRequestHandler.js"
								}, {
									"type" : "text/javascript",
									"src" : "plugin/myplacesdraw/GetGeometryRequestHandler.js"
								},{
									"type" : "text/javascript",
									"src" : "plugin/myplaceshover/HoverPlugin.js"
								}, {
									"type" : "text/javascript",
									"src" : "request/StopDrawingRequest.js"
								}, {
									"type" : "text/javascript",
									"src" : "request/StartDrawingRequest.js"
								}, {
									"type" : "text/javascript",
									"src" : "request/GetGeometryRequest.js"
								}, {
									"type" : "text/javascript",
									"src" : "service/MyPlacesService.js"
								}, {
									"type" : "text/javascript",
									"src" : "service/MyPlacesWFSTStore.js"
								}, {
									"type" : "text/javascript",
									"src" : "ui/module/myplaces-module.js"
								},{
									"type" : "text/javascript",
									"src" : "ui/view/CategoryPanel.js"
								},{
									"type" : "text/javascript",
									"src" : "ui/view/MyPlacePanel.js"
								},{
									"type" : "text/javascript",
									"src" : "ui/view/MyPlacesGridPanel.js"
								},{
									"type" : "text/javascript",
									"src" : "ui/view/MyPlacesGrid.js"
								},{
									"type" : "text/javascript",
									"src" : "ui/view/MyPlacesMainPanel.js"
								},{
									"type" : "text/javascript",
									"src" : "ui/view/MyPlacesWizard.js"
								},{
									"type" : "text/javascript",
									"src" : "ui/view/MyPlacesPlaceSelectedControls.js"
								} ],
						"resources" : []
					},
					"bundle" : {
						"manifest" : {
							"Bundle-Identifier" : "myplaces",
							"Bundle-Name" : "myplaces",
							"Bundle-Icon" : {
								"href" : "icon.png"
							},
							"Bundle-Author" : [ {
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
							} ],
							"Bundle-Name-Locale" : {
								"fi" : {
									"Name" : "OmatPaikat",
									"Title" : "Omat Paikat"
								},
								"en" : {}
							},
							"Bundle-Version" : "1.0.0",
							"Import-Namespace" : [ "Oskari", "Ext" ]
						}
					}
				});

/**
 * Install this bundle
 */
Oskari.bundle_manager.installBundleClass("myplaces",
		"Oskari.mapframework.bundle.MyPlacesBundle");
