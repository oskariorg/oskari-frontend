

Oskari.clazz
		.define(
				"Oskari.mapframework.bundle.WebFormBundle",
				function() {

				},

				{
					"create" : function() {

						return Oskari.clazz
								.create("Oskari.mapframework.bundle.WebFormBundleInstance");
					},
					"update" : function(manager, bundle, bi, info) {

					}

				},

				{

					"protocol" : [ "Oskari.bundle.Bundle",
							"Oskari.mapframework.bundle.extension.ExtensionBundle" ],
					"source" : {

						"scripts" : [ {
							"type" : "text/css",
							"src" : "pagestyle.css"
						},{
							"type" : "text/javascript",
							"src" : "instance.js"
						},{
							"type" : "text/javascript",
							"src" : "app.js"
						}, {

							"type" : "text/javascript",
							"src" : "ui/manager/webform-ui-facade.js"
						}, {

							"type" : "text/javascript",
							"src" : "ui/manager/webform-ui-manager.js"
						} ],
						"resources" : []
					},
					"bundle" : {
						"manifest" : {
							"Bundle-Identifier" : "webform",
							"Bundle-Name" : "webform",
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
									"Name" : " candy-2",
									"Title" : " candy-2"
								},
								"en" : {}
							},
							"Bundle-Version" : "1.0.0",
							"Import-Namespace" : [ "Oskari" ],
							"Import-Bundle" : {}
						}
					}
				});

Oskari.bundle_manager.installBundleClass("webform",
		"Oskari.mapframework.bundle.WebFormBundle");
