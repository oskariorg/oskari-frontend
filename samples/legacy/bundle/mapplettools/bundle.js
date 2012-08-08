
/**
 * Bundle
 * 
 * @class Oskari.mapframework.bundle.NlsFiMappletToolsBundle
 */
Oskari.clazz
		.define(

				"Oskari.mapframework.bundle.NlsFiMappletToolsBundle",

				function() {
				},

				{
					/*
					 * implementation for protocol 'Oskari.bundle.Bundle'
					 */
					"create" : function() {

						return Oskari.clazz
								.create("Oskari.mapframework.bundle.NlsFiMappletToolsBundleInstance");
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
							"Oskari.mapframework.module.Module",
							"Oskari.mapframework.bundle.extension.ExtensionBundle" ],
					"source" : {

						"scripts" : [ {
							"type" : "text/javascript",
							"src" : "mapplettools.js"
						}, {
							"type" : "text/javascript",
							"src" : "applet_kutsuu.js"
						}, {
							"type" : "text/javascript",
							"src" : "appletin_kaytto.js"
						},{
							"type" : "text/javascript",
							"src" : "instance.js"
						}
						],
						"resources" : []
					},
					"bundle" : {
						"manifest" : {
							"Bundle-Identifier" : "mapplettools",
							"Bundle-Name" : "mapplettools",
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
									"Name" : "Kartta",
									"Title" : "Kartta"
								},
								"en" : {}
							},
							"Bundle-Version" : "1.0.0",
							"Import-Namespace" : [ "Oskari", "Ext",
									"Mapplet" ]
						}
					}
				});

/**
 * Install this bundle
 */
Oskari.bundle_manager.installBundleClass("mapplettools",
		"Oskari.mapframework.bundle.NlsFiMappletToolsBundle");
