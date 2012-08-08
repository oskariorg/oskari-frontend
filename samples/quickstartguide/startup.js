/*Ext.require( [ '*' ]);

 Ext.Loader.setConfig( { enabled : true }); Ext.Loader.setPath('Ext.ux',
 '../../map-application-framework/lib/ext-4.0.2a/examples/ux/');
 */
Oskari.clazz.define('Oskari.framework.oskari.QuickStartGuide', function() {

	this.args = null;
}, {

	/**
	 *
	 */
	processArgs : function(args) {
		this.args = args;
	},
	showLoader : function() {
		Ext.MessageBox.show({
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

		Oskari.bundle_manager.registerLoaderStateListener(function(bl) {
			bls[bl.loader_identifier] = bl;
			var total = 0;
			var curr = 0;
			var count = 0;
			for(bli in bls) {
				count++;
				total += bls[bli].filesRequested;
				curr += bls[bli].filesLoaded;
			}
			var pc = total != 0 ? (curr / total) : 1;
			Ext.MessageBox.updateProgress(pc, '(' + count + ')');

		});
	},
	hideLoader : function() {
		Ext.MessageBox.hide();
	},
	/**
	 * @method start
	 *
	 */
	start : function() {
		var me = this;

		var runner = Oskari.app;
		var args = this.args;

		var appSetup = {
			startupSequence : [
			/* OpenLayers */
			{
				callback : function(bi) {
					me.showLoader();
				},
				title : 'OpenLayers with Proj4',
				fi : 'OpenLayers with Proj4',
				sv : '?',
				en : 'OpenLayers with Proj4',
				bundlename : 'openlayers-map-full',
				bundleinstancename : 'openlayers-map-full',
				metadata : {
					"Import-Bundle" : {
						"openlayers-map-full" : {
							bundlePath : '../openlayers/bundle/'
						},
						"openlayers-default-theme" : {
							bundlePath : '../openlayers/bundle/'
						}
					},
					/**
					 * A list of bundles to be started
					 */
					"Require-Bundle-Instance" : ['openlayers-default-theme']
				}
			}, {
				callback : function(bi) {
					/**
					 * up and running - app specific
					 * code in
					 * bundle/quickstartguide/bundle.js
					 */

					me.hideLoader();

					/**
					 * Now we have the framework bundles
					 * and classes. Let's start the
					 * framework & create some more
					 * class instances.
					 */
					var app = bi.getApp();
					app.startFramework();

					app.getUserInterface().getFacade().expandPart('W');
					app.getUserInterface().getFacade().expandPart('E');

					/**
					 * Loading is done. Let's hide
					 * status.
					 */

				},
				title : 'QuickStartGuide',
				fi : 'QuickStartGuide',
				sv : '?',
				en : 'QuickStartGuide',
				bundlename : 'quickstartguide',
				bundleinstancename : 'quickstartguide',
				metadata : {
					"Import-Bundle" : {
						"core-base" : {
							bundlePath : '../../packages/framework/bundle/'
						},
						"core-map" : {
							bundlePath : '../../packages/framework/bundle/'
						},
						"sandbox-base" : {
							bundlePath : '../../packages/framework/bundle/'
						},
						"sandbox-map" : {
							bundlePath : '../../packages/framework/bundle/'
						},
						"event-base" : {
							bundlePath : '../../packages/framework/bundle/'
						},

						"event-map" : {
							bundlePath : '../../packages/framework/bundle/'
						},
						"event-map-layer" : {
							bundlePath : '../../packages/framework/bundle/'
						},
						"event-map-full" : {
							bundlePath : '../../packages/framework/bundle/'
						},
						"request-base" : {
							bundlePath : '../../packages/framework/bundle/'
						},
						"request-map" : {
							bundlePath : '../../packages/framework/bundle/'
						},
						"request-map-layer" : {
							bundlePath : '../../packages/framework/bundle/'
						},
						"request-map-full" : {
							bundlePath : '../../packages/framework/bundle/'
						},
						"service-base" : {
							bundlePath : '../../packages/framework/bundle/'
						},
						"service-map" : {
							bundlePath : '../../packages/framework/bundle/'
						},
						"common" : {
							bundlePath : '../../packages/framework/bundle/'
						},
						"mapmodule-plugin" : {
							bundlePath : '../../packages/framework/bundle/'
						},
						"domain" : {
							bundlePath : '../../packages/framework/bundle/'
						},
						"runtime" : {
							bundlePath : '../../packages/framework/bundle/'
						},
						"mapster" : {
							bundlePath : '../../packages/framework/bundle/'
						},
						"mapposition" : {
							bundlePath : '../../packages/framework/bundle/'
						},
						"mapcontrols" : {
							bundlePath : '../../packages/framework/bundle/'
						},
						"mapoverlaypopup" : {
							bundlePath : '../../packages/framework/bundle/'
						},
						"layerselector" : {
							bundlePath : '../../packages/framework/bundle/'
						},

						"searchservice" : {
							bundlePath : '../../packages/framework/bundle/'
						},
						"mapfull" : {
							bundlePath : '../../packages/framework/bundle/'
						},
						"layerhandler" : {
							bundlePath : '../../packages/framework/bundle/'
						},

						"mapportal" : {
							bundlePath : '../portal/bundle/'
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
							bundlePath : '../../packages/framework/bundle/'
						}
						/*
						 * "myplaces" : { bundlePath :
						 * defBundlePath }
						 */

					},

					/**
					 * A list of bundles to be started
					 */
					"Require-Bundle-Instance" : []

				},
				instanceProps : {

				}
			},

			/*
			 * Map and Extensions
			 */
			{
				callback : function(bi) {

					/**
					 * Let's zoom somewhere with sights
					 * familiar
					 */
					bi.sandbox.postRequestByName('MapMoveRequest', [385576, 6675364, 8, false]);

					/**
					 * Let's add map controls at this
					 * stage as those have a hardcoded
					 * dependency to MainMapModule
					 */
					Oskari.bundle_facade.requireBundle("mapcontrols", "mapcontrols", function(manager, b) {
						var ctrls = manager.createInstance("mapcontrols");
						ctrls.start();
					});
					/**
					 * Load unpacked bundles dynamically
					 */
					Oskari.setLoaderMode('dev');

					/*
					 * Oskari.bundle_facade.requireBundle("myplaces","myplaces",
					 * function(manager,b){ var myplaces =
					 * manager
					 * .createInstance("myplaces");
					 * myplaces.start(); });
					 */

				},
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
					"Require-Bundle-Instance" : ["layerhandler", "layerselection", "layerselector",
					// "searchservice",
					"mapoverlaypopup", "mapposition",
					// "sample",
					// "twitter", //
					// twitter will not
					// work in IE < 9
					"wikipedia", "trains", "positioninfo"]

				},
				instanceProps : {

				}
			}]

		};

		runner.setApplicationSetup(appSetup);
		runner.startApplication(function() {
		}, args)
	}
});

Ext.onReady(function() {

	var args = null;
	if(location.search.length > 1) {
		args = Ext.urlDecode(location.search.substring(1));
	} else {
		args = {};
	}

	if(args.oskariLoaderMode)
		Oskari.setLoaderMode(args.oskariLoaderMode);
	else
		Oskari.setLoaderMode('yui');
	if(args.oskariLoaderAsync && args.oskariLoaderAsync == 'on') {
		Oskari.setSupportBundleAsync(true);
	}

	var runner = Oskari.clazz.create('Oskari.framework.oskari.QuickStartGuide');
	runner.processArgs(args);
	runner.start();
});
