
/**
 * Bundle
 */
Oskari.clazz
		.define(

				"Oskari.mapframework.bundle.ClazzBrowserBundle",

				function() {

				},

				{
					/*
					 * implementation for protocol 'Oskari.bundle.Bundle'
					 */
					"create" : function() {

						return Oskari.clazz
								.create("Oskari.mapframework.bundle.ClazzBrowserBundleInstance");
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
							"type" : 'text/javascript',
							"src" : 'prettify.js'
						}, {
							"type" : 'text/css',
							"src" : 'prettify.css'
						},{
							"type" : "text/javascript",
							"src" : "instance.js"
						},{
							"type" : "text/javascript",
							"src" : "ui.js"
						}]

					},
					"bundle" : {
						"manifest" : {
							"Bundle-Identifier" : "clazzbrowser",
							"Bundle-Name" : "ClazzBrowser",
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
									"Name" : " ClazzBrowser",
									"Title" : " ClazzBrowser"
								},
								"en" : {}
							},
							"Bundle-Version" : "1.0.0",
							"Import-Namespace" : [ "Oskari", "Ext",
									"OpenLayers" ],
							"Import-Bundle" : {
								"mapoverlaypopup" : {},
								"layerhandler" : {}
							}

						}
					}
				});

/**
 * Install this bundle by instantating the Bundle Class
 * 
 */
Oskari.bundle_manager.installBundleClass("clazzbrowser",
		"Oskari.mapframework.bundle.ClazzBrowserBundle");
