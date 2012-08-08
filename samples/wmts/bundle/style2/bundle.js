Oskari.clazz
		.define(
				"Oskari.mapframework.bundle.Style2Bundle",
				function() {

				},

				{
					"create" : function() {

						return this;/*
									 * Oskari.clazz
									 * .create("Oskari.mapframework.bundle.Style2BundleInstance");
									 */
					},
					"start" : function() {
					},
					"stop" : function() {
					},

					"update" : function(manager, bundle, bi, info) {

					}

				},

				{

					"protocol" : [ "Oskari.bundle.Bundle",
							"Oskari.bundle.BundleInstance",
							"Oskari.mapframework.bundle.extension.ExtensionBundle" ],
					"source" : {

						"scripts" : [ {
							"type" : "text/css",
							"src" : "style.css"

						}, {
							"type" : "text/css",
							"src" : "maptools.css"
						} ],
						"resources" : []
					},
					"bundle" : {
						"manifest" : {
							"Bundle-Identifier" : "style2",
							"Bundle-Name" : "Style2",
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
									"Name" : " style-1",
									"Title" : " style-1"
								},
								"en" : {}
							},
							"Bundle-Version" : "1.0.0",
							"Import-Namespace" : [ "Oskari" ],
							"Import-Bundle" : {}
						}
					}
				});

Oskari.bundle_manager.installBundleClass("style2",
		"Oskari.mapframework.bundle.Style2Bundle");
