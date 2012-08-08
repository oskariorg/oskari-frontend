Ext.require(['*']);
/*
 * Ext.Loader.setConfig( { enabled : true }); Ext.Loader.setPath('Ext.ux',
 * '../../map-application-framework/lib/ext-4.0.2a/examples/ux/');
 */

Oskari.clazz.define('Oskari.framework.oskari.Wmts', function() {

	this.styleBndl = null;
}, {
	processArgs : function(args) {
		this.styleBndl = args.style;
	},
	applyStyleBundle : function() {

		if(!this.styleBndl)
			return;

		var styleBndl = this.styleBndl;

		var bndls = {
			title : 'Map',
			fi : 'Map',
			sv : '?',
			en : 'Map',
			bundlename : styleBndl,
			bundleinstancename : styleBndl,
			metadata : {
				"Import-Bundle" : {},
				"Require-Bundle-Instance" : []
			},
			instanceProps : {}
		};

		bndls.metadata['Import-Bundle'][styleBndl] = {
			bundlePath : 'bundle/'
		};

		Oskari.bundle_facade.playBundle(bndls, function(bi) {

		});
	},
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

		me.applyStyleBundle();
		/** use sample bundle to fire the engine * */
		var appSetup = this.appSetup;
		var app = Oskari.app;

		app.setApplicationSetup(appSetup);
		app.startApplication(function(startupInfos) {
			var bi = startupInfos.bundlesInstanceInfos['candy-2'].bundleInstance;

			me.startExtensions(bi);

		});
	},
	/**
	 *
	 *
	 */
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
			bundlename : 'candy-2',
			bundleinstancename : 'candy-2',
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
					/*
					 * "service-map-full" : { bundlePath :
					 * '../../packages/framework/bundle/' },
					 */
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
					"mapoverlaypopup" : {
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

					"mapposition" : {
						bundlePath : '../../packages/framework/bundle/'
					},

					"layerselection" : {
						bundlePath : '../../packages/framework/bundle/'
					},
					"layerselector" : {
						bundlePath : '../../packages/framework/bundle/'
					},
					"mapcontrols" : {
						bundlePath : 'bundle/'
					},

					"candy-2" : {
						bundlePath : 'bundle/'
					},
					"wmtsmodule" : {
						bundlePath : 'bundle/'
					},
					"wmts" : {
						bundlePath : 'bundle/'
					},
					"layers" : {
						bundlePath : 'bundle/'
					},
					"mapwmts" : {
						bundlePath : '../../packages/framework/bundle/'
					},
					"wmtsstats" : {
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
		Ext.MessageBox.hide();

		Oskari.clazz.category('Oskari.mapframework.core.Core', 'search-methods', {
			handleSearchRequest : function(searchRequest) {
				this.printDebug("Doing search '" + searchRequest.getSearchString() + "'...");
				this.actionInProgressSearch();
				var searchService = this.getService('Oskari.mapframework.service.SearchService');
				searchService.doSearch(searchRequest.getSearchString(), searchRequest.getOnSuccess(), searchRequest.getOnComplete());
			}
		});
		/**
		 * up and running - app specific code in
		 * bundle/candy-2/bundle.js
		 */
		var app = bi.getApp();
		var sandbox = app.getSandbox();

		var mapmodule = sandbox.findRegisteredModuleInstance('MainMapModule');

		var wmtsPlugin = Oskari.clazz.create('Oskari.mapframework.wmts.mapmodule.plugin.WmtsLayerPlugin');
		mapmodule.registerPlugin(wmtsPlugin);
		mapmodule.startPlugin(wmtsPlugin);

		/*
		 * this is required to get the path to sample caps file
		 */
		var manager = bi.mediator.manager;
		var bundlePath = manager.stateForBundleDefinitions['wmts'].bundlePath;
		var capsPath = bundlePath
		// +
		// "/geowebcache-wmts-zoom-no-zoom.xml";
		+ "/karttatiili-geowebcache-wmts-caps.xml";

		app.getWmtsService().readWMTSCapabilites('jkorhonen', capsPath, "EPSG_3067_PTI");

		sandbox.postRequestByName('MapMoveRequest', [385576, 6675364, 8, false]);

		/* app.getUserInterface().getFacade().expandPart('ToolMenu'); */

		Ext.MessageBox.hide();

		/*
		 * Oskari.bundle_facade .requireBundle( "wmtsstats",
		 * "wmtsstats", function(manager, b) { var wmtsstats =
		 * manager .createInstance("wmtsstats"); wmtsstats
		 * .start(); });
		 */

	}
});

Ext.onReady(function() {
	var args = null;
	if(location.search.length > 1) {
		args = Ext.urlDecode(location.search.substring(1));
	} else {
		args = {};
	}

	if(args.oskariLoaderMode) {
		Oskari.setLoaderMode(args.oskariLoaderMode);
	} else {
		Oskari.setLoaderMode('yui');
		Oskari.setSupportBundleAsync(true);
	}
	if(args.oskariLoaderAsync && args.oskariLoaderAsync == 'on') {
		Oskari.setSupportBundleAsync(true);
	}

	var app = Oskari.clazz.create('Oskari.framework.oskari.Wmts');
	app.processArgs(args);
	app.start();
});
