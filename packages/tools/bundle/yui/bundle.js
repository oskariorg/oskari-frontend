/**
 * @class Oskari.framework.bundle.SampleBundleInstance
 */

/**
 * @class Oskari.framework.bundle.SampleBundle
 * 
 */
Oskari.clazz
		.define(
				"Oskari.tools.yui.Bundle",
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
					"stop" : function() {
					},
					/**
					 * @method update
					 * 
					 * Called by Bundle Manager to provide state information to
					 * bundle
					 * 
					 */
					"update" : function() {

					}

				},

				/**
				 * metadata
				 */
				{

					"protocol" : [ "Oskari.bundle.Bundle","Oskari.bundle.BundleInstance" ],
					"source" : {

						"scripts" : [{
							"type" : "text/javascript",
							"src" : "yui.js"
						}],
						"resources" : []
					},
					"bundle" : {
						"manifest" : {
							"Bundle-Identifier" : "yui",
							"Bundle-Name" : "tools.yui.Bundle",
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
									"Name" : " tools.yui.Bundle",
									"Title" : "tools.yui.Bundle"
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
Oskari.bundle_manager.installBundleClass("yui",
		"Oskari.tools.yui.Bundle");
