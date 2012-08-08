Oskari.clazz.define('Oskari.framework.oskari.Sample4', function() {
	this.sandbox = null;
}, {

	/**
	 *
	 */
	init : function(sandbox) {
		this.sandbox = sandbox;
	},
	getName : function() {
		return "Sample4";
	},
	/**
	 * @method start
	 *
	 */
	start : function() {

		var me = this;

		/**
		 * Some UI Candy for your entertainment
		 */
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
		/**
		 * up and running - app specific code in
		 * bundle/sample-4/bundle.js
		 */
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

		Oskari.setLoaderMode('yui');

		var appSetup = this.appSetup;
		var app = Oskari.app;

		app.setApplicationSetup(appSetup);
		app.startApplication(function(startupInfos) {
			Ext.MessageBox.hide();
			me.instance = startupInfos.bundlesInstanceInfos['sample-4'].bundleInstance;
			me.startExtensions(me.instance);

		}, {});

	},
	appSetup : {
		startupSequence : [{
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
			title : 'Map',
			fi : 'Map',
			sv : '?',
			en : 'Map',
			bundlename : 'sample-4',
			bundleinstancename : 'sample-4',
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
					"layers" : {
						bundlePath : 'bundle/'
					},
					/*
					 * "minimal" : { bundlePath :
					 * '../example-bundles/bundle/' }
					 */

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

					"layerhandler" : {
						bundlePath : '../../packages/framework/bundle/'
					},

					"searchservice" : {
						bundlePath : '../../packages/framework/bundle/'
					},

					"mapfull" : {
						bundlePath : '../../packages/framework/bundle/'
					},

					"mapportal" : {
						bundlePath : '../portal/bundle/'
					},

					"sample-4" : {
						bundlePath : 'bundle/'
					},
					"yui" : {
						bundlePath : '../tools/bundle/'
					}

				},

				/**
				 * A list of bundles to be started
				 */
				"Require-Bundle-Instance" : []

			},
			instanceProps : {

			}
		}]
	},

	startExtensions : function(bi) {

		/**
		 * Now we have the framework bundles and classes. Let's
		 * start the framework & create some more class
		 * instances.
		 */
		var app = bi.getApp();
		app.startFramework();

		app.getUserInterface().getFacade().expandPart('W');
		app.getUserInterface().getFacade().expandPart('E');

		/**
		 * Loading is done. Let's hide status.
		 */

		/**
		 * Let's fire some bundle instances
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

					"layerselection" : {
						bundlePath : 'bundle/'
					}

				},

				"Require-Bundle-Instance" : ["layerhandler", "layerselection", "layerselector",
				// "searchservice",
				"mapoverlaypopup"]

			},
			instanceProps : {

			}
		};

		Oskari.bundle_facade.playBundle(bnlds, function(bi) {

			/*
			 * core.processRequest(core.getRequestBuilder('MapMoveRequest')(
			 * 545108, 6863352, 5,false));
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

	Oskari.clazz.create('Oskari.framework.oskari.Sample4').start();
});
