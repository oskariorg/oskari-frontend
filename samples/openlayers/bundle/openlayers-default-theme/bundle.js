/**
 * @class Oskari.mapframework.bundle.SampleBundleInstance
 */

/**
 * @class Oskari.mapframework.bundle.SampleBundle
 * 
 */

Oskari.clazz
		.define(
				"Oskari.mapframework.openlayers.theme.default.Bundle",
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

					/**
					 * @method update
					 * 
					 * Called by Bundle Manager to provide state information to
					 * bundle
					 * 
					 */
					"update" : function(manager, bundle, bi, info) {

					},
					"start" : function() {
						var bundlePath = this.mediator.manager.stateForBundleDefinitions['openlayers-default-theme'].bundlePath;

						OpenLayers.ImgPath = bundlePath + '/img/';
					},
					"stop" : function() {
						// delete OpenLayers...just joking
				}

				},

				/**
				 * metadata
				 */
				{

					"protocol" : [ "Oskari.bundle.Bundle",
							"Oskari.bundle.BundleInstance" ],
					"source" : {

						"scripts" : [ {
							"type" : "text/css",
							"src" : "../../../../resources/openlayers/theme/default/style.css"
						} ],
						"resources" : []
					},
					"bundle" : {
						"manifest" : {
							"Bundle-Identifier" : "openlayers-default-theme",
							"Bundle-Name" : "mapframework.openlayers-default-theme.Bundle",
							"Bundle-Tag" : {
								"mapframework" : true
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
										"Part" : "OpenLayers",
										"License-Name" : "BSD",
										"License-Online-Resource" : "http://svn.openlayers.org/trunk/openlayers/license.txt"
									},
									"License" : {
										"Part" : "Proj4JS",
										"License-Name" : "LGPL/BSD",
										"License-Online-Resource" : ""
									}
								}
							} ],
							"Bundle-Name-Locale" : {
								"fi" : {
									"Name" : " mapframework.core.Bundle",
									"Title" : " mapframework.core.Bundle"
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
Oskari.bundle_manager.installBundleClass("openlayers-default-theme",
		"Oskari.mapframework.openlayers.theme.default.Bundle");
