/*Ext.require( [ '*' ]);
 */



/**
 * Hacks
 */
var debug_injectScriptElement = Ext.Loader.injectScriptElement;
var debug_files = [];
var debug_classes = [];
var debug_extras = {};
Ext.Loader.injectScriptElement = function() {

	debug_files.push( {
		"context" : "inject",
		"type" : "text/javascript",
		"src" : arguments[0]
	});
	return debug_injectScriptElement.apply(Ext.Loader, arguments);
};

var debug_require = Ext.Loader.require;

Ext.Loader.require = function(expressions, fn, scope, excludes) {
	debug_classes.push( {
		require : expressions
	});
	console.log("REQUIRE", expressions);
	return debug_require.apply(Ext.Loader, arguments);
}
Ext.require = Ext.Loader.require;

var debug_triggerCreated = Ext.ClassManager.triggerCreated;

Ext.ClassManager.triggerCreated = function(className) {
	debug_classes.push( {
		created : className
	});
	console.log("CREATED", className);
	return debug_triggerCreated.apply(Ext.ClassManager, arguments);
}

var debug_loadScriptFile = Ext.Loader.loadScriptFile;

Ext.Loader.loadScriptFile = function(url, onLoad, onError, scope, synchronous) {
	console.log("LOADING", url);
	debug_files.push( {
		"context" : "loadCall",
		"type" : "text/javascript",
		"src" : arguments[0]
	});
	return debug_loadScriptFile.apply(Ext.Loader, arguments);
}

Oskari.debug_stats = function() {
	var count = 0;
	for ( var n = 0, len = debug_files.length; n < len; n++) {
		var itm = debug_files[n];

		if (itm.context == 'loadCall')
			count++;
	}

	var count_created = 0;
	var count_requires = 0;
	var count_extras = 0;

	var createdClasses = {};
	var requiredClasses = {};
	var extraClasses = {};

	for ( var n = 0, len = debug_classes.length; n < len; n++) {
		var itm = debug_classes[n];

		if (itm.created) {
			count_created++;
			createdClasses[itm.created] = true;
		}
		if (itm.require) {

			for ( var i = 0; i < itm.require.length; i++) {
				var req = itm.require[i];
				if (requiredClasses[req])
					continue;
				requiredClasses[req] = true;
				count_requires++;
			}

		}
	}

	for (e in debug_extras) {
		if (requiredClasses[e])
			continue;
		extraClasses[e] = true;
		count_extras++;
	}

	console.log("================== Loaded " + count + " files");
	console.log("================== Created " + count_created + " classes");
	console
			.log("================== Resolved Required Classes"
					+ count_requires);
	console.log("================== Created Unreferenced Classes"
			+ count_extras);

	var clsssForInclusion = [];
	var clsssForExclusion = [];

	for ( var n = 0, len = debug_classes.length; n < len; n++) {
		var itm = debug_classes[n];

		if (itm.created)
			clsssForInclusion.push(itm.created);
	}
	for (e in extraClasses) {
		clsssForExclusion.push(e);
	}
	return {
		include : clsssForInclusion,
		exclude : clsssForExclusion,
		createdClasses: createdClasses,
		requiredClasses: requiredClasses,
		extraClasses: extraClasses
	};
}


/*
*
*/

Ext.Loader.setConfig( {
	enabled : true,
	paths : {
		'Ext' : '../../../sencha/ext-4.1.0-beta-2/src',
		'Ext.ux' : '../../../sencha/ext-4.1.0-beta-2/examples/ux',
		'Ext.app' : '../../../sencha/ext-4.1.0-beta-2/examples/portal/classes'
	}
});


Ext.require('Ext.window.MessageBox');
Ext.require('Ext.ux.statusbar.StatusBar');
Ext.require('Ext.panel.Panel');
Ext.require('Ext.tab.Panel');
Ext.require('Ext.toolbar.Toolbar');
Ext.require('Ext.container.Viewport');
Ext.require('Ext.app.PortalDropZone');
Ext.require('Ext.app.PortalColumn');
Ext.require('Ext.app.PortalPanel');
Ext.require('Ext.app.Portlet');
Ext.require('Ext.layout.container.Column'); // Portlet needs this - doesn't require
Ext.require('Ext.fx.*');
Ext.require('Ext.layout.container.Border'); 
Ext.require('Ext.button.Split'); 
Ext.require('Ext.form.Label');
Ext.require('Ext.slider.Single');
Ext.require('Ext.grid.feature.Grouping');
Ext.require('Ext.grid.Panel');
Ext.require('Ext.data.proxy.JsonP');
Ext.require('Ext.grid.column.Action');
Ext.require('Ext.form.Panel');
Ext.require('Ext.form.FieldSet');
Ext.require('Ext.layout.container.Absolute');
Ext.require('Ext.toolbar.Spacer');
Ext.require('Ext.toolbar.Item');
Ext.require('Ext.menu.Menu');
Ext.require('Ext.menu.Item');
Ext.require('Ext.menu.Separator');
Ext.require('Ext.ux.data.PagingMemoryProxy');


Oskari.clazz
		.define(
				'Oskari.framework.oskari.QuickStartGuide',
				function() {

				},
				{

					/**
					 * 
					 */

					/**
					 * @method start
					 * 
					 */
					start : function() {


						var me = this;

						/**
						 * some bundles are loaded from framework directory
						 * (sources are actually located in coreBundlePath but
						 * bundle defs are in ../framework)
						 */
						

						/**
						 * portal is located adjacent to this one
						 * 
						 */
						

						/**
						 * Let's start bundle named 'quickstartguide'
						 * 
						 * This lists any dependencies that need to be loaded.
						 * 
						 * This starts the main bundle 'quickstartguide' which
						 * can be found in bundle/quickstartguide/bundle.js
						 * 
						 */

						var def = {
							title : 'Map',
							fi : 'Map',
							sv : '?',
							en : 'Map',
							bundlename : 'quickstartguide',
							bundleinstancename : 'quickstartguide',
							metadata : {
								"Import-Bundle" : {
									"core-base" : {
										bundlePath : '../framework/bundle/'
									},
									"core-map" : {
										bundlePath : '../framework/bundle/'
									},
									"sandbox-base" : {
										bundlePath : '../framework/bundle/'
									},
									"sandbox-map" : {
										bundlePath : '../framework/bundle/'
									},
									"event-base" : {
										bundlePath : '../framework/bundle/'
									},

									"event-map" : {
										bundlePath : '../framework/bundle/'
									},
									"event-map-layer" : {
										bundlePath : '../framework/bundle/'
									},
									"event-map-full" : {
										bundlePath : '../framework/bundle/'
									},
									"request-base" : {
										bundlePath : '../framework/bundle/'
									},
									"request-map" : {
										bundlePath : '../framework/bundle/'
									},
									"request-map-layer" : {
										bundlePath : '../framework/bundle/'
									},
									"request-map-full" : {
										bundlePath : '../framework/bundle/'
									},
									"service-base" : {
										bundlePath : '../framework/bundle/'
									},
									"service-map" : {
										bundlePath : '../framework/bundle/'
									},
									"common" : {
										bundlePath : '../framework/bundle/'
									},
									"mapmodule-plugin" : {
										bundlePath : '../framework/bundle/'
									},
									"domain" : {
										bundlePath : '../framework/bundle/'
									},
									"runtime" : {
										bundlePath : '../framework/bundle/'
									},
									"mapster" : {
										bundlePath : '../framework/bundle/'
									},
									"mapposition" : {
										bundlePath : '../framework/bundle/'
									},
									"mapcontrols" : {
										bundlePath : '../framework/bundle/'
									},
									"mapoverlaypopup" : {
										bundlePath : '../framework/bundle/'
									},
									"layerselector" : {
										bundlePath : '../framework/bundle/'
									},

									"searchservice" : {
										bundlePath : '../framework/bundle/'
									},
									"mapfull" : {
										bundlePath : '../framework/bundle/'
									},
									"layerhandler" : {
										bundlePath : '../framework/bundle/'
									},

									"mapportal" : {
										bundlePath : '../portal/bundle/'
									},
									"layers" : {
										bundlePath : '../quickstartguide/bundle/'
									},
									"layerselection" : {
										bundlePath : '../quickstartguide/bundle/'
									},
									"openlayers-map-full" : {
										bundlePath : '../openlayers/bundle/'
									},

									"yui" : {
										bundlePath : '../tools/bundle/'
									},
									"quickstartguide" : {
										bundlePath : '../quickstartguide/bundle/'
									},
									"mapwmts" : {
										bundlePath : '../framework/bundle/'
									}
								/*
								 * "myplaces" : { bundlePath : defBundlePath }
								 */

								},

								/**
								 * A list of bundles to be started
								 */
								"Require-Bundle-Instance" : []

							},
							instanceProps : {

							}
						};

						Ext.MessageBox.show( {
							title : 'Oskari Clazz Zystem',
							msg : '...',
							progressText : '...',
							width : 300,
							progress : true,
							closable : false,
							icon : 'logo',
							modal : false
						});

						var bls = {};

						Oskari.bundle_manager
								.registerLoaderStateListener(function(bl) {
									bls[bl.loader_identifier] = bl;
									var total = 0;
									var curr = 0;
									var count = 0;
									for (bli in bls) {
										count++;
										total += bls[bli].filesRequested;
										curr += bls[bli].filesLoaded;
									}
									var pc = total != 0 ? (curr / total) : 1;
									Ext.MessageBox.updateProgress(pc,
											'(' + count + ')');

								});

						/** use sample bundle to fire the engine * */
						Oskari.bundle_facade
								.playBundle(
										def,
										function(bi) {

											/**
											 * up and running - app specific
											 * code in
											 * bundle/quickstartguide/bundle.js
											 */

											Ext.MessageBox.hide();
											/**
											 * Now we have the framework bundles
											 * and classes. Let's start the
											 * framework & create some more
											 * class instances.
											 */
											var app = bi.getApp();
											app.startFramework();

											app.getUserInterface().getFacade()
													.expandPart('W');
											app.getUserInterface().getFacade()
													.expandPart('E');

											/**
											 * Loading is done. Let's hide
											 * status.
											 */

											Ext.MessageBox.hide();
											/**
											 * Let's Start some additional
											 * bundle instances
											 */
											var bnlds = {
												title : 'Map',
												fi : 'Map',
												sv : '?',
												en : 'Map',
												bundlename : 'mapmodule-plugin',
												bundleinstancename : 'mapmodule-plugin',
												metadata : {
													"Import-Bundle" : {

														"sample" : {
															bundlePath : '../quickstartguide/bundle/'
														},
														"positioninfo" : {
															bundlePath : '../quickstartguide/bundle/'
														},
														"twitter" : {
															bundlePath : '../quickstartguide/bundle/'
														},
														"trains" : {
															bundlePath : '../quickstartguide/bundle/'
														},
														"wikipedia" : {
															bundlePath : '../quickstartguide/bundle/'
														}

													},
													"Require-Bundle-Instance" : [
															"layerhandler",
															"layerselection",
															"layerselector",
															// "searchservice",
															"mapoverlaypopup",
															"mapposition",
															// "sample",
															// "twitter", //
															// twitter will not
															// work in IE < 9
															"wikipedia",
															"trains",
															"positioninfo" ]

												},
												instanceProps : {

												}
											};

											Oskari.bundle_facade
													.playBundle(
															bnlds,
															function(bi) {

																/**
																 * Let's zoom
																 * somewhere
																 * with sights
																 * familiar
																 */
																bi.sandbox
																		.postRequestByName(
																				'MapMoveRequest',
																				[
																						385576,
																						6675364,
																						8,
																						false ]);

																/**
																 * Let's add map
																 * controls at
																 * this stage as
																 * those have a
																 * hardcoded
																 * dependency to
																 * MainMapModule
																 */
																Oskari.bundle_facade
																		.requireBundle(
																				"mapcontrols",
																				"mapcontrols",
																				function(
																						manager,
																						b) {
																					var ctrls = manager
																							.createInstance("mapcontrols");
																					ctrls
																							.start();
																				});

																/**
																 * Load unpacked
																 * bundles
																 * dynamically
																 */
																Oskari
																		.setLoaderMode('dev');

																debug_stats();
																/*
																 * Oskari.bundle_facade.requireBundle("myplaces","myplaces",
																 * function(manager,b){
																 * var myplaces =
																 * manager
																 * .createInstance("myplaces");
																 * myplaces.start();
																 * });
																 */

															});

										});
					}
				}

		);

Ext.onReady(function() {

	var args = null;
	if (location.search.length > 1) {
		args = Ext.urlDecode(location.search.substring(1));
	} else {
		args = {};
	}

	if (args.oskariLoaderMode)
		Oskari.setLoaderMode(args.oskariLoaderMode);
	else
		Oskari.setLoaderMode('yui');
	if (args.oskariLoaderAsync && args.oskariLoaderAsync == 'on') {
		Oskari.setSupportBundleAsync(true);
	}

	Ext.require( [ 'Ext.window.MessageBox' ], function() {
		Oskari.clazz.create('Oskari.framework.oskari.QuickStartGuide').start();
	});
});