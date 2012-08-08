Ext.require(['*']);
/*
 * Ext.Loader.setConfig( { enabled : true }); Ext.Loader.setPath('Ext.ux',
 * '../../map-application-framework/lib/ext-4.0.2a/examples/ux/');
 */
Oskari.clazz.define('Oskari.framework.oskari.Akp', function() {

}, {

	/**
	 *
	 */

	/**
	 * @method start
	 *
	 */
	start : function() {

		var me = this;

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
		var appSetup = this.appSetup;
		var app = Oskari.app;

		app.setApplicationSetup(appSetup);
		app.startApplication(function(startupInfos) {
			me.instance = startupInfos.bundlesInstanceInfos['legacy'].bundleInstance;
			me.startExtensions(me.instance);
		}, {});

	},
	appSetup : {
		startupSequence : [{
			title : 'Map',
			fi : 'Map',
			sv : '?',
			en : 'Map',
			bundlename : 'legacy',
			bundleinstancename : 'legacy',
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
					"mapwmts" : {
						bundlePath : '../../packages/framework/bundle/'
					},
					/*
					 * "layerselector" : { bundlePath :
					 * '../../packages/framework/bundle/' },
					 */

					"searchservice" : {
						bundlePath : '../../packages/framework/bundle/'
					},
					"mapfull" : {
						bundlePath : '../../packages/framework/bundle/'
					},
					"layerhandler" : {
						bundlePath : '../../packages/framework/bundle/'
					},
					"layers" : {
						bundlePath : 'bundle/'
					},
					/*
					 * "layerselection" : { bundlePath :
					 * '../../packages/framework/bundle/' },
					 */
					"openlayers-map" : {
						bundlePath : '../openlayers/bundle/'
					},

					"yui" : {
						bundlePath : '../tools/bundle/'
					},
					"legacy" : {
						bundlePath : 'bundle/'
					},
					"openlayers-default-theme" : {
						bundlePath : '../openlayers/bundle/'
					}
				},
				/**
				 * A list of bundles to be started
				 */
				"Require-Bundle-Instance" : ['openlayers-default-theme']

			},
			instanceProps : {

			}
		}]
	},

	/**
	 * @method startExtensions
	 */
	startExtensions : function(bi) {

		/**
		 * up and running - app specific code in
		 * bundle/Akp/bundle.js
		 */

		Ext.MessageBox.hide();
		/**
		 * Now we have the framework bundles and classes. Let's
		 * start the framework & create some more class
		 * instances.
		 */
		var app = bi.getApp();
		app.startFramework();

		/*
		 * app.getUserInterface().getFacade() .expandPart('W');
		 */

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
			bundlename : 'mapplet',
			bundleinstancename : 'mapplet',
			metadata : {
				"Import-Bundle" : {
					"mapplet" : {
						bundlePath : 'bundle/'
					},
					"overview" : {
						bundlePath : '../example-bundles/bundle/'
					},
					"wikipedia" : {
						bundlePath : '../quickstartguide/bundle/'
					}

				},
				"Require-Bundle-Instance" : ["layerhandler",
				/*
				* "layerselection", "layerselector",
				*/
				// "searchservice",
				"mapoverlaypopup", "mapposition", "overview", "wikipedia"]

			},
			instanceProps : {

			}
		};

		Oskari.bundle_facade.playBundle(bnlds, function(bi) {

			/**
			 * Let's zoom somewhere with sights familiar
			 */
			bi.sandbox.postRequestByName('MapMoveRequest', [385576, 6675364, 8, false]);

			/**
			 * Let's add map controls at this stage as those
			 * have a hardcoded dependency to MainMapModule
			 */
			/*
			 * Oskari.bundle_facade .requireBundle(
			 * "mapcontrols", "mapcontrols", function( manager,
			 * b) { var ctrls = manager
			 * .createInstance("mapcontrols"); ctrls .start();
			 * });
			 */

			/*
			 * Oskari.bundle_facade.requireBundle("myplaces","myplaces",
			 * function(manager,b){ var myplaces = manager
			 * .createInstance("myplaces"); myplaces.start();
			 * });
			 */

		});
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

	Oskari.clazz.create('Oskari.framework.oskari.Akp').start();
});
