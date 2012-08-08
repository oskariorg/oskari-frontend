
/**
 * 
 * @class Oskari.mapframework.bundle.WikipediaBundle
 * Bundle
 * 
 */
Oskari.clazz
		.define(

				"Oskari.mapframework.bundle.WikipediaBundle",

				function() {
					
				
					
				},

				{
					/*
					 * implementation for protocol 'Oskari.bundle.Bundle'
					 */
					"create" : function() {

						return Oskari.clazz
								.create("Oskari.mapframework.bundle.WikipediaBundleInstance");
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
							"src" : "ui.js"
						},{
							"type" : "text/javascript",
							"src" : "instance.js"
						}],
						"resources" : []
					},
					"bundle" : {
						"manifest" : {
							"Bundle-Identifier" : "wikipedia",
							"Bundle-Name" : "wikipedia",
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
									"Name" : " Wikipedia",
									"Title" : " Wikipedia"
								},
								"en" : {}
							},
							"Bundle-Version" : "1.0.0",
							"Import-Namespace" : [ "Oskari", "Ext" ],
							"Import-Bundle" : {
								"mapoverlaypopup" : {},
								"layerhandler" : {}
							}

						}
					}
				});

/**
 * Install this bundle
 */
Oskari.bundle_manager.installBundleClass("wikipedia",
		"Oskari.mapframework.bundle.WikipediaBundle");