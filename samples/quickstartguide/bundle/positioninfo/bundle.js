/**
 * @class Oskari.mapframework.bundle.PositionInfo Bundle
 * 
 */
Oskari.clazz
		.define(

				"Oskari.mapframework.bundle.PositionInfo",

				function() {
				},

				{
					/*
					 * implementation for protocol 'Oskari.bundle.Bundle'
					 */
					"create" : function() {

						return Oskari.clazz
								.create("Oskari.mapframework.bundle.PositionInfoInstance");
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

						"scripts" : [ {
							"type" : "text/javascript",
							"src" : "instance.js"
						}, {
							"type" : "text/javascript",
							"src" : "ui.js"
						} ],
						"resources" : []
					},
					"bundle" : {
						"manifest" : {
							/**
							 * This SHALL match identifier in installBundleClass
							 * call below
							 */
							"Bundle-Identifier" : "positioninfo",
							"Bundle-Name" : "positioninfo",
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
									"Name" : "positioninfo",
									"Title" : "positioninfo"
								},
								"en" : {}
							},
							"Bundle-Version" : "1.0.0",
							"Import-Namespace" : [ "Oskari", "OpenLayers",
									"Ext" ],
							"User-Interface" : {
								"Console" : {},
								"Toolbox" : {},
								"Inspector" : {},
								"View" : {},
								"Map" : {
									"Layers" : {}
								}
							}
						}
					}
				});

/**
 * Install this bundle
 */
Oskari.bundle_manager.installBundleClass("positioninfo",
		"Oskari.mapframework.bundle.PositionInfo");
