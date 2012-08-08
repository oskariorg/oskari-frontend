/**
 * @class Oskari.mapframework.bundle.AkpBundle
 */
Oskari.clazz
		.define(
				"Oskari.mapframework.bundle.AkpBundle",
				function() {

				},

				{
					"create" : function() {

						return Oskari.clazz
								.create("Oskari.mapframework.bundle.AkpBundleInstance");
					},
					"update" : function(manager, bundle, bi, info) {

					}

				},

				{

					"protocol" : [ "Oskari.bundle.Bundle",
							"Oskari.mapframework.bundle.extension.ExtensionBundle" ],
					"source" : {

						"scripts" : [{
								"type" : "text/javascript",
								"src" : "app.js"
							},
							{
								"type" : "text/javascript",
								"src" : "ui/manager/akp-ui-manager.js"
							},
							{
								"type" : "text/javascript",
								"src" : "ui/manager/akp-ui-facade.js"
							},{
								"type" : "text/javascript",
								"src" : "instance.js"
							}
						             
						 ],
						"resources" : []
					},
					"bundle" : {
						"manifest" : {
							"Bundle-Identifier" : "legacy",
							"Bundle-Name" : "Akp",
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
									"Name" : " Akp",
									"Title" : " Akp"
								},
								"en" : {}
							},
							"Bundle-Version" : "1.0.0",
							"Import-Namespace" : [ "Oskari" ],
							"Import-Bundle" : {}
						}
					}
				});

Oskari.bundle_manager.installBundleClass("legacy",
		"Oskari.mapframework.bundle.AkpBundle");

