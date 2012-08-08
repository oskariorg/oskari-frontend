

/**
 * @class Oskari.mapframework.bundle.TwitterBundle
 * 
 */
Oskari.clazz
		.define(
				"Oskari.mapframework.bundle.TwitterBundle",
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

						return Oskari.clazz
								.create("Oskari.mapframework.bundle.TwitterBundleInstance");
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

					"protocol" : [ "Oskari.bundle.Bundle",
							"Oskari.mapframework.bundle.extension.ExtensionBundle" ],
					"source" : {

						"scripts" : [{
							"type" : "text/javascript",
							"src" : "instance.js"
						}  
						],
						"resources" : []
					},
					"bundle" : {
						"manifest" : {
							/**
							 * This must match one used in installBundleClass
							 * below
							 */
							"Bundle-Identifier" : "twitter",
							"Bundle-Name" : "twitter",
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
									"Name" : " twitter",
									"Title" : " twitter"
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
 * identifier must match one from manifest above
 */
Oskari.bundle_manager.installBundleClass("twitter",
		"Oskari.mapframework.bundle.TwitterBundle");
