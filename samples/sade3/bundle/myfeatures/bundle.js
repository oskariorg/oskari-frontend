
/**
 * Bundle
 */
Oskari.clazz
		.define(

				"Oskari.mapframework.bundle.MyFeaturesBundle",

				function() {
				},

				{
					/*
					 * implementation for protocol 'Oskari.bundle.Bundle'
					 */
					"create" : function() {

						return Oskari.clazz
								.create("Oskari.mapframework.bundle.MyFeaturesBundleInstance");
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

						"scripts" : [
								{
									"type" : "text/javascript",
									"src" : "service/MyFeatureService.js"
								}, {
									"type" : "text/javascript",
									"src" : "service/MyFeaturesLocalStore.js"
								},
								
								{
									"type" : "text/javascript",
									"src" : "ui/module/myfeatures-module.js"
								},
								{
									"type" : "text/javascript",
									"src" : "instance.js"
								}
								
								
								],
						"resources" : []
					},
					"bundle" : {
						"manifest" : {
							"Bundle-Identifier" : "myfeatures",
							"Bundle-Name" : "myfeatures",
							"Bundle-Tag" : {
							 
							},

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
Oskari.bundle_manager.installBundleClass("myfeatures",
		"Oskari.mapframework.bundle.MyFeaturesBundle");
