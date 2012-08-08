/**
 * @class Oskari.mapframework.bundle.SampleBundleInstance
 */

/**
 * @class Oskari.mapframework.bundle.SampleBundle
 * 
 */
Oskari.clazz
		.define(
				"Oskari.mapframework.phase-b.Bundle",
				/**
				 * @constructor
				 * 
				 * Bundle's constructor is called when bundle is created. At
				 * this stage bundle sources have been loaded, if bundle is
				 * loaded dynamically.
				 * 
				 */
				function() {

					/*
					 * Any bundle specific classes may be declared within
					 * constructor to enable stealth mode
					 * 
					 * When running within map application framework - Bundle
					 * may refer classes declared with Oskari.clazz.define() -
					 * Bundle may refer classes declared with Ext.define -
					 * Bundle may refer classes declared within OpenLayers
					 * libary
					 * 
					 * 
					 */
				},

				{
					/*
					 * @method create
					 * 
					 * called when a bundle instance will be created
					 * 
					 */
					"create" : function() {

						return this;
					},
					
					"start" : function() {
					},

					/**
					 * @method update
					 * 
					 * Called by Bundle Manager to provide state information to
					 * bundle
					 * 
					 */
					"update" : function(manager, bundle, bi, info) {

					}

				},

				/**
				 * metadata
				 */
				{

					"protocol" : [ "Oskari.bundle.Bundle" ],
					"source" : {

						"scripts" : [

								{
									"type" : "text/javascript",
									"src" : "../../../../map-application-framework/lib/proj4js-1.0.1/lib/defs/EPSG3067.js"
								},
								{
									"type" : "text/javascript",
									"src" : "../../../../map-application-framework/lib/proj4js-1.0.1/lib/defs/EPSG4326.js"
								},
								{
									"type" : "text/javascript",
									"src" : "../../../../map-application-framework/lib/ext-4.0.7-gpl/examples/portal/classes/PortalColumn.js"
								},
								{
									"type" : "text/javascript",
									"src" : "../../../../map-application-framework/lib/ext-4.0.7-gpl/examples/portal/classes/PortalPanel.js"
								},
								{
									"type" : "text/javascript",
									"src" : "../../../../map-application-framework/lib/ext-4.0.7-gpl/examples/portal/classes/PortalDropZone.js"
								},
								{
									"type" : "text/javascript",
									"src" : "../../../../map-application-framework/lib/ext-4.0.7-gpl/examples/portal/classes/Portlet.js"
								},
								{
									"type" : "text/javascript",
									"src" : "../../../../map-application-framework/lib/ext-4.0.7-gpl/examples/ux/statusbar/StatusBar.js"
								},

								{
									"type" : "text/javascript",
									"src" : "../../../../map-application-framework/lib/ext-4.0.7-gpl/examples/ux/data/PagingMemoryProxy.js"
								},
								{
									"type" : "text/javascript",
									"src" : "Starter.js"
								}

						],
						"resources" : []
					},
					"bundle" : {
						"manifest" : {
							"Bundle-Identifier" : "phase-b",
							"Bundle-Name" : "mapframework.phase-b.Bundle",
							"Bundle-Tag" : {
								/*"mapframework" : true*/
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
									"Name" : " mapframework.service.Bundle",
									"Title" : " mapframework.service.Bundle"
								},
								"en" : {}
							},
							"Bundle-Version" : "1.0.0",
							"Import-Namespace" : [ "Oskari" ],
							"Import-Bundle" : {}
						}
					}
				});

/**
 * Install this bundle by instantating the Bundle Class
 * 
 */
Oskari.bundle_manager.installBundleClass("phase-b",
		"Oskari.mapframework.phase-b.Bundle");
