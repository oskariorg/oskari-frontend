Ext.require( [ '*' ]);
/*
 * Ext.Loader.setConfig( { enabled : true }); Ext.Loader.setPath('Ext.ux',
 * '../../map-application-framework/lib/ext-4.0.2a/examples/ux/');
 */
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
						var frameworkBundlePath = '../framework/bundle/';

						/**
						 * portal is located adjacent to this one
						 * 
						 */
						var portalBundlePath = '../portal/bundle/';
						
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
										bundlePath : frameworkBundlePath
									},
									"core-map" : {
										bundlePath : frameworkBundlePath
									},
									"sandbox-base" : {
										bundlePath : frameworkBundlePath
									},
									"sandbox-map" : {
										bundlePath : frameworkBundlePath
									},
									"event-base" : {
										bundlePath : frameworkBundlePath
									},

									"event-map" : {
										bundlePath : frameworkBundlePath
									},
									"event-map-layer" : {
										bundlePath : frameworkBundlePath
									},
									"event-map-full" : {
										bundlePath : frameworkBundlePath
									},
									"request-base" : {
										bundlePath : frameworkBundlePath
									},
									"request-map" : {
										bundlePath : frameworkBundlePath
									},
									"request-map-layer" : {
										bundlePath : frameworkBundlePath
									},
									"request-map-full" : {
										bundlePath : frameworkBundlePath
									},
									"service-base" : {
										bundlePath : frameworkBundlePath
									},
									"service-map" : {
										bundlePath : frameworkBundlePath
									},
									"common" : {
										bundlePath : frameworkBundlePath
									},
									"mapmodule-plugin" : {
										bundlePath : frameworkBundlePath
									},
									"domain" : {
										bundlePath : frameworkBundlePath
									},
									"runtime" : {
										bundlePath : frameworkBundlePath
									},
									"mapster" : {
										bundlePath : frameworkBundlePath
									},
									"mapposition" : {
										bundlePath : frameworkBundlePath
									},
									"mapcontrols" : {
										bundlePath : frameworkBundlePath
									},
									"mapoverlaypopup" : {
										bundlePath : frameworkBundlePath
									},
									"layerselector" : {
										bundlePath : frameworkBundlePath
									},
									
									"searchservice" : {
										bundlePath : frameworkBundlePath
									},
									"mapfull" : {
										bundlePath : frameworkBundlePath
									},
									"layerhandler" : {
										bundlePath : frameworkBundlePath
									},

									"mapportal" : {
										bundlePath : portalBundlePath
									},
									"layers" : {
										bundlePath : 'bundle/'
									},
									"layerselection" : {
										bundlePath : 'bundle/'
									},
									"openlayers-map-full" : {
										bundlePath : '../openlayers/bundle/'
									},
									
									"yui" : {
										bundlePath : '../tools/bundle/'
									},
									"quickstartguide" : {
										bundlePath : 'bundle/'
									},
									"mapwmts" : {
										bundlePath : frameworkBundlePath
									}
									/*
									"myplaces" : {
										bundlePath : defBundlePath
									}*/

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
						Oskari.bundle_facade.playBundle(def, function(bi) {

							/**
							 * up and running - app specific code in
							 * bundle/quickstartguide/bundle.js
							 */

							Ext.MessageBox.hide();
							/**
							 * Now we have the framework bundles and classes.
							 * Let's start the framework & create some more
							 * class instances.
							 */
							var app = bi.getApp();
							app.startFramework();

							app.getUserInterface().getFacade().expandPart('W');
							app.getUserInterface().getFacade().expandPart('E');

							/**
							 * Loading is done. Let's hide status.
							 */
							
							Ext.MessageBox.hide();
							/**
							 * Let's Start some additional bundle instances
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
									bundlePath : 'bundle/'
								},
								"positioninfo" : {
									bundlePath : 'bundle/'
								},
								"twitter" : {
									bundlePath : 'bundle/'
								},
								"trains" : {
									bundlePath : 'bundle/'
								},
								"wikipedia" : {
									bundlePath : 'bundle/'
								}
								
										},
										"Require-Bundle-Instance" : [
										                             "layerhandler",
										                             "layerselection",
										                             "layerselector",
										                             // "searchservice",
										                             "mapoverlaypopup",
										                             "mapposition",
										                             //"sample",
										                             //"twitter", // twitter will not work in IE < 9
										                             //"wikipedia",
										                             //"trains",
										                             "positioninfo"
										                             ]

									},
									instanceProps : {

									}
								};
							
							
							Oskari.bundle_facade.playBundle(bnlds, function(bi) {

								/**
								 * Let's zoom somewhere with sights familiar
								 */
								bi.sandbox.postRequestByName('MapMoveRequest',[385576,6675364, 8,false]);

								/**
								 * Let's add map controls at this stage as those have a hardcoded 
								 * dependency to MainMapModule
								 */
								Oskari.bundle_facade.requireBundle("mapcontrols","mapcontrols",
										function(manager,b){
									var ctrls = manager
									.createInstance("mapcontrols");
									ctrls.start();
								});
								
								/**
								 * Load unpacked bundles dynamically  
								 */
								Oskari.setLoaderMode('dev');
								
								/*Oskari.bundle_facade.requireBundle("myplaces","myplaces",
										function(manager,b){
									var myplaces = manager
									.createInstance("myplaces");
									myplaces.start();
								});*/
								
								
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
    
	if( args.oskariLoaderMode ) 
		Oskari.setLoaderMode(args.oskariLoaderMode);
	else
		Oskari.setLoaderMode('yui');
	if(args.oskariLoaderAsync&& args.oskariLoaderAsync=='on') {
		Oskari.setSupportBundleAsync(true);
	}
/*	
	var pnl = Ext.create('Ext.panel.Panel',{
        flex: 1, html: 'Press GO', style: 'font-size: 32pt'
    });

        Ext.create('Ext.window.Window',{ title: 'Test', width: 256, height: 384, layout: 'fit', items: [
		Ext.create('Ext.form.Panel',{ 
			layout: {
      			  type: 'fit',
			        align: 'middle'
			    },
			items: [
			pnl],
			buttons: [
			{ xtype: 'button', text: 'Go', handler: function() {	

		var dte = new Date();
		var counter = 0;

		window.setTimeout(function(){
				pnl.update('Running');*/
				Oskari.clazz.create('Oskari.framework.oskari.QuickStartGuide').start(); 
/*			}, (60-dte.getSeconds())*1000-(1000-dte.getMilliseconds()) 
		);
	
	}
	} ] }) ] } ).show();*/
});
