/*
* Ext.Loader.setConfig( { enabled : true }); Ext.Loader.setPath('Ext.ux',
* '../../map-application-framework/lib/ext-4.0.2a/examples/ux/');
*/

/**
 * @class Oskari.poc.Sade3Demo
 *
 * starter class for webform demo
 */
Oskari.clazz.define('Oskari.poc.Sade3Demo', function() {

	this.styleBndl = null;
}, {
	processArgs : function(args) {
		this.styleBndl = args.style;
		this.args = args;
	},
	/**
	 * @method applyStyleBundle
	 *
	 * applies CSS style defs bundle
	 * based on style query parameter
	 *
	 */
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
	 * starts bundles declared in property appSetup.startupSequence
	 *
	 *
	 */
	start : function() {

		var me = this;

		me.applyStyleBundle();

		var me = this;
		var appSetup = this.appSetup;
		var app = Oskari.app;

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

		app.setApplicationSetup(appSetup);
		app.startApplication(function(startupInfos) {
			Ext.MessageBox.hide();
			var bi = startupInfos.bundlesInstanceInfos['webform'].bundleInstance;
			var app = bi.getApp();
			var manager = bi.mediator.manager;
			me.startExtensions(app, manager);

		}, {});

	},
	/**
	 * @static
	 * @property  appSetup.startupSequence
	 */
	appSetup : {
		startupSequence : [{
			title : 'OpenLayers with Proj4',
			fi : 'OpenLayers with Proj4',
			sv : '?',
			en : 'OpenLayers with Proj4',
			bundlename : 'openlayers-default',
			bundleinstancename : 'openlayers-default',
			metadata : {
				"Import-Bundle" : {
					"openlayers-default" : {
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
		},

		/*
		 * Let's start bundle named 'webform'
		 */
		{
			title : 'Map',
			fi : 'Map',
			sv : '?',
			en : 'Map',
			bundlename : 'webform',
			bundleinstancename : 'webform',
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

					"webform" : {
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
					"myplaces" : {
						bundlePath : '../../packages/framework/bundle/'
					},
					"yui" : {
						bundlePath : '../tools/bundle/'
					},
					"sade3" : {
						bundlePath : '../example-bundles/bundle/'
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

	/**
	 * @method startExtensions
	 *
	 * starts any extension bundles
	 *
	 *
	 */
	startExtensions : function(app, manager) {
		/**
		 * up and running - app specific code in
		 * bundle/webform/bundle.js
		 */
		var me = this;
		var sandbox = app.getSandbox();

		sandbox.postRequestByName('MapMoveRequest', [385576, 6675364, 8, false]);

		/**
		 * add some bundles
		 */

		/**
		 * get a reference to mainmapmodule
		 */
		var mapmodule = sandbox.findRegisteredModuleInstance('MainMapModule');

		/**
		 * add WMTS support
		 */
		var wmtsPlugin = Oskari.clazz.create('Oskari.mapframework.wmts.mapmodule.plugin.WmtsLayerPlugin');
		mapmodule.registerPlugin(wmtsPlugin);
		mapmodule.startPlugin(wmtsPlugin);

		/*
		 * this is required to get the path to sample caps file
		 */

		var bundlePath = manager.stateForBundleDefinitions['wmts'].bundlePath;
		var capsPath = bundlePath + "/karttatiili-geowebcache-wmts-caps.xml";

		app.getWmtsService().readWMTSCapabilites('wmts', capsPath, "EPSG_3067_PTI");

		/* Oskari.setLoaderMode('dev'); */

		/* Temp Hack */
		var usr = Oskari.$("sandbox").getUser()
		usr._name = 'ossi';
		usr._uuid = '123123132';
		usr._loggedIn = true;

		/** Let's start MyFeatures * */

		var me = this;

		var def = {
			title : 'MyFeatures',
			fi : 'Omat kohteet',
			sv : '?',
			en : 'My Features',
			bundlename : 'myfeatures',
			bundleinstancename : 'myfeatures',
			metadata : {
				"Import-Bundle" : {
					"myfeatures" : {
						bundlePath : 'bundle/'
					}
					/*
					 * , "positioninfo" : { bundlePath :
					 * '../quickstartguide/bundle/' }, "wikipedia" : {
					 * bundlePath : '../quickstartguide/bundle/' }
					 */

				},
				/**
				 * A list of bundles to be started
				 */
				"Require-Bundle-Instance" : ["mapoverlaypopup"/*
				 * ,
				 * "positioninfo",
				 * "wikipedia"
				 */]
			}
		};

		/** use sample bundle to fire the engine * */
		Oskari.bundle_facade.playBundle(def, function(bi) {

			var webFormApp = app.webFormApp;
			var lm = webFormApp.getLayerManager();
			var worker = webFormApp.getWorker();

			worker.start();

			/**
			 * Temp hack
			 */
			var facade = Oskari.$("UI.facade");
			facade.getParts()['BundleButtons'].add({
				xtype : 'button',
				text : 'Tallenna',
				height : 96,
				baseCls : 'bndlsbar',
				iconCls : 'bndls-webform-send',
				renderTpl : facade
				.getParts()['BundleButtonsTpl'],
				tooltip : 'send_webform',
				handler : function() {
					Ext.MessageBox.show({
						title : 'Tallennetaan',
						msg : '...',
						progressText : '...',
						width : 300,
						progress : true,
						closable : false,
						icon : 'logo',
						modal : false
					});
					window.setTimeout(function() {
						Ext.MessageBox.hide();
					}, 500);
				}
			});

			/**
			 * Oskari.bundle_facade
			 * .requireBundle( "wikipedia",
			 * "wikipedia", function(manager, b) {
			 * var myfeats = manager
			 * .createInstance("wikipedia");
			 * myfeats.start(); });
			 *
			 */
			Oskari.clazz.category('Oskari.mapframework.core.Core', 'search-methods', {
				handleSearchRequest : function(searchRequest) {
					this.printDebug("Doing search '" + searchRequest.getSearchString() + "'...");
					this.actionInProgressSearch();
					var searchService = this.getService('Oskari.mapframework.service.SearchService');
					searchService.doSearch(searchRequest.getSearchString(), searchRequest.getOnSuccess(), searchRequest.getOnComplete());
				}
			});

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

	Oskari.setLoaderMode('yui');
	var app = Oskari.clazz.create('Oskari.poc.Sade3Demo');
	app.processArgs(args);
	app.start();

});
