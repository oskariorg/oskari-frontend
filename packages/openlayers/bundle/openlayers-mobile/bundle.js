/**
 * @class Oskari.mapframework.bundle.SampleBundleInstance
 */

/**
 * @class Oskari.mapframework.bundle.SampleBundle
 * 
 */

(function() {

	var srcs = [];

	Oskari.clazz
			.define(
					"Oskari.mapframework.openlayers.mobile.Bundle",
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
						 * When running within map application framework -
						 * Bundle may refer classes declared with
						 * Oskari.clazz.define() - Bundle may refer classes
						 * declared with Ext.define - Bundle may refer classes
						 * declared within OpenLayers libary
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
						 * Called by Bundle Manager to provide state information
						 * to bundle
						 * 
						 */
						"update" : function(manager, bundle, bi, info) {

						},
						"start" : function() {
						},
						"stop" : function() {
							// delete OpenLayers...just joking
						}

					},

					/**
					 * metadata
					 */
					{

						"protocol" : [ "Oskari.bundle.Bundle","Oskari.bundle.BundleInstance" ],
						"source" : {

							"scripts" : [
							             {
							            	 "type" : "text/javascript",
							            	 "src" : "../../../../map-application-framework/lib/proj4js-1.0.1/lib/proj4js-compressed.js" 
							             },
							             {
							            	 "type" : "text/javascript",
							            	 "src" : "defs.js" 
							             },
							             {
							            	 "type" : "text/javascript",
							            	 "src" : "../openlayers-build/mobile/OpenLayers.js" 
							             }
							             ],
							"resources" : []

							
						},
						"bundle" : {
							"manifest" : {
								"Bundle-Identifier" : "openlayers-mobile",
								"Bundle-Name" : "mapframework.openlayers-mobile.Bundle",
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
										"License" : [{
											"Part" : "OpenLayers",
											"License-Name" : "BSD",
											"License-Online-Resource" : "http://svn.openlayers.org/trunk/openlayers/license.txt"
										}, {
											"Part" : "Proj4JS",
											"License-Name" : "LGPL/BSD",
											"License-Online-Resource" : ""
										}]
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
	Oskari.bundle_manager.installBundleClass("openlayers-mobile",
			"Oskari.mapframework.openlayers.mobile.Bundle");

})();
