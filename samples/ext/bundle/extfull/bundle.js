Oskari.clazz
		.define(

				"Oskari.ext.ExtFull",

				function() {
				},
				{ /*
					 * implementation for protocol 'Oskari.bundle.Bundle'
					 */
					"create" : function() {

						return this;
					},

					"update" : function() {

					},

					"start" : function() {

					},

					"stop" : function() {

					}

				},

				/**
				 * metadata
				 */
				{

					"protocol" : [ "Oskari.bundle.Bundle",
							"Oskari.bundle.BundleInstance" ],
					"source" : {

						"scripts" : [
								{
									type : "text/javascript",
									src : "classes.js"
								},
								{
									type : "text/javascript",
									"src" : "../../../../map-application-framework/lib/ext-4.0.7-gpl/examples/portal/classes/PortalColumn.js"
								},
								{
									type : "text/javascript",
									"src" : "../../../../map-application-framework/lib/ext-4.0.7-gpl/examples/portal/classes/PortalPanel.js"
								},
								{
									type : "text/javascript",
									"src" : "../../../../map-application-framework/lib/ext-4.0.7-gpl/examples/portal/classes/PortalDropZone.js"
								},
								{
									type : "text/javascript",
									"src" : "../../../../map-application-framework/lib/ext-4.0.7-gpl/examples/portal/classes/Portlet.js"
								},
								{
									type : "text/javascript",
									"src" : "../../../../map-application-framework/lib/ext-4.0.7-gpl/examples/ux/statusbar/StatusBar.js"
								},

								{
									type : "text/javascript",
									"src" : "../../../../map-application-framework/lib/ext-4.0.7-gpl/examples/ux/data/PagingMemoryProxy.js"
								}

						],
						"resources" : [],


					},
					"bundle" : {
						"manifest" : {
							"Bundle-Identifier" : "extfull",
							"Bundle-Name" : "extfull",
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
									"Name" : "Haku",
									"Title" : "Haku"
								},
								"en" : {}
							},
							"Bundle-Version" : "1.0.0",
							"Import-Namespace" : [ "Oskari" ]
						}

					}
				});

/**
 * Install this bundle
 */
Oskari.bundle_manager.installBundleClass("extfull", "Oskari.ext.ExtFull");
