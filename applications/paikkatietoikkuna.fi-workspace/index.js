/*
 * 
 * @class Oskari.paikkatietoikkuna.standalone.Main
 * 
 * Let's start app in hybrid fashion for developing additional bundles
 * to paikkatietoikkuna.fi.
 *
 * All framework bundle code is loaded from servers in preloaded mode.
 * All additional bundles will be loaded from workspace in develop mode.
 *
 * This will load bundles in this order
 *
 * 1) Map (preloaded from server)
 * 2) DIV Manazer (preloaded from server)
 * 3) Additional framework bundles (preloaded from server)
 * 4) Any workspace bundles in dev mode
 *
 */
Oskari.clazz.define('Oskari.paikkatietoikkuna.standalone.Main', function() {
	/**
	 * @property appSetup
	 * this will be loaded from json file appsetup.json
	 */
	this.appSetup = null;
	
	/**
	 * @property appConfig
	 * this will be loaded from json file config.json
	 */
	this.appConfig = null;
	
	/**
	 * @property sandbox
	 * this will be initialized after mapfull has instantiated Oskari framework core and sandbox
	 */
	this.sandbox = null;
}, {
	getSandbox: function() {
		return this.sandbox;
	},
	/**
	 * @method downloadConfig
	 * loads bundle config (from local file)
	 */
	downloadConfig : function(notifyCallback) {
		var me = this;
		jQuery.ajax({
			type : 'GET',
			dataType : 'json',
			url : 'config.json',
			beforeSend : function(x) {
				if(x && x.overrideMimeType) {
					x.overrideMimeType("application/j-son;charset=UTF-8");
				}
			},
			success : function(config) {
				me.appConfig = config;
				notifyCallback();
			}
		});
	},
	
	/**
	 * @method downloadAppSetup
	 * jquery load of application base bundle setup (from local file)
	 *  
	 */
	downloadAppSetup : function(notifyCallback) {
		var me = this;
		jQuery.ajax({
			type : 'GET',
			dataType : 'json',
			url : 'appsetup.json',
			beforeSend : function(x) {
				if(x && x.overrideMimeType) {
					x.overrideMimeType("application/j-son;charset=UTF-8");
				}
			},
			success : function(setup) {
				me.appSetup = setup;
				notifyCallback();
			}
		});
	},
	
	/**
	 * @method startBaseBundles
	 * 
	 * starts base bundless preloaded from server  
	 * 
	 */
	startBaseBundles : function() {
		// check that both setup and config are loaded
		// before actually starting the application
		var me = this;
		if(!(me.appSetup && me.appConfig)) {
			return;
		}

		var app = Oskari.app;
		app.setApplicationSetup(me.appSetup);
		app.setConfiguration(me.appConfig);
		app.startApplication(function(startupInfos) {
			// all bundles have been loaded
			me.sandbox = Oskari.$("sandbox");
			me.startAdditionalBundles();
		});
	},
	
	/**
	 * @method start
	 * starts the application by loading setup and config
	 * and starting the basebundles preloaded from server followed by additional bundles
	 * from workspace in development moede
	 * 
	 */
	start : function() {
		var me = this;

		me.downloadAppSetup(function() {
			me.startBaseBundles();
		});
		me.downloadConfig(function() {
			me.startBaseBundles();
		});
	},
	
	/**
	 * @method startAdditionalBundles
	 * 
	 * this will load any declared bundles from workspace
	 * 
	 */
	startAdditionalBundles : function() {
		var me = this;

		/* from now on, let's play locally */
		Oskari.setPreloaded(false);
		Oskari.setBundleBasePath('../');

		/* we now have The Sandbox (instantiated in mapfull) which will be used to dispatch request and events */
		var sandbox = Oskari.$("sandbox");

		/* at this point we have divman so we can start any bundles that require divman */
		var bndlLen = me.configs.bundles.length;
		var bndlCount = 0;
		for(var n = 0; n < bndlLen; n++) {

			Oskari.bundle_facade.playBundle(me.configs.bundles[n], function() {
				bndlCount++;
				if(bndlCount == bndlLen) {
					me.bundleConfigurationReady();
				}
			});
		}
	},
	/**
	 * @property configs additional bundle configs
	 * @static
	 */
	configs : {
		bundles : [{
			"title" : "layerselector2",
			"en" : "layerselector2",
			"fi" : "layerselector2",
			"sv" : "layerselector2",
			"bundleinstancename" : "layerselector2",
			"bundlename" : "layerselector2",
			"instanceProps" : {  },
			"metadata" : {
				"Import-Bundle" : {
					"layerselector2" : {
						"bundlePath" : "../../packages/framework/bundle/"
					}
				},
				"Require-Bundle-Instance" : []
			}
		}, {
			"title" : "layerselection2",
			"en" : "layerselection2",
			"fi" : "layerselection2",
			"sv" : "layerselection2",
			"bundleinstancename" : "layerselection2",
			"bundlename" : "layerselection2",
			"instanceProps" : {  },
			"metadata" : {
				"Import-Bundle" : {
					"layerselection2" : {
						"bundlePath" : "../../packages/framework/bundle/"
					}
				},
				"Require-Bundle-Instance" : []
			}
		}, {
			"title" : "toolbar",
			"en" : "toolbar",
			"fi" : "toolbar",
			"sv" : "toolbar",
			"bundleinstancename" : "toolbar",
			"bundlename" : "toolbar",
			"instanceProps" : {  },
			"metadata" : {
				"Import-Bundle" : {
					"toolbar" : {
						"bundlePath" : "../../packages/framework/bundle/"
					}
				},
				"Require-Bundle-Instance" : []
			}
		}, {
			"title" : "metadataflyout",
			"en" : "metadataflyout",
			"fi" : "metadataflyout",
			"sv" : "metadataflyout",
			"bundleinstancename" : "metadataflyout",
			"bundlename" : "metadataflyout",
			"instanceProps" : {  },
			"metadata" : {
				"Import-Bundle" : {
					"metadataflyout" : {
						"bundlePath" : "../../packages/catalogue/bundle/"
					}
				},
				"Require-Bundle-Instance" : []
			}
		}, {
			"title" : "coordinatedisplay",
			"en" : "coordinatedisplay",
			"fi" : "coordinatedisplay",
			"sv" : "coordinatedisplay",
			"bundleinstancename" : "coordinatedisplay",
			"bundlename" : "coordinatedisplay",
			"instanceProps" : {  },
			"metadata" : {
				"Import-Bundle" : {
					"coordinatedisplay" : {
						"bundlePath" : "../../packages/catalogue/bundle/"
					}
				},
				"Require-Bundle-Instance" : []
			}
		}, {
			"title" : "search",
			"en" : "search",
			"fi" : "search",
			"sv" : "search",
			"bundleinstancename" : "search",
			"bundlename" : "search",
			"instanceProps" : {  },
			"metadata" : {
				"Import-Bundle" : {
					"search" : {
						"bundlePath" : "../../packages/catalogue/bundle/"
					}
				},
				"Require-Bundle-Instance" : []
			}
		}, {
			"title" : "personaldata",
			"en" : "personaldata",
			"fi" : "personaldata",
			"sv" : "personaldata",
			"bundleinstancename" : "personaldata",
			"bundlename" : "personaldata",
			"instanceProps" : {  },
			"metadata" : {
				"Import-Bundle" : {
					"personaldata" : {
						"bundlePath" : "../../packages/catalogue/bundle/"
					}
				},
				"Require-Bundle-Instance" : []
			}
		}, {
			"title" : "infobox",
			"en" : "infobox",
			"fi" : "infobox",
			"sv" : "infobox",
			"bundleinstancename" : "infobox",
			"bundlename" : "infobox",
			"instanceProps" : {  },
			"metadata" : {
				"Import-Bundle" : {
					"infobox" : {
						"bundlePath" : "../../packages/catalogue/bundle/"
					}
				},
				"Require-Bundle-Instance" : []
			}
		}]
	},

	/**
	 * @method bundleConfigurationReady
	 * 
	 * this will be called when any bundles have been loaded
	 * 
	 */
	bundleConfigurationReady : function() {
		var me = this;
		var sandbox = me.getSandbox();
		
			
	}
});

/*
 * application jQuery entry point
 */
jQuery(document).ready(function() {
	
	Oskari.setLang('fi');
	
	/* This will enable to load javascripts from server */
	Oskari.setLoaderMode('dev');
	Oskari.setPreloaded(true);
	Oskari.setBundleBasePath('../');
	
	/* this will start the application and load part of the application from server 
	 * and additional functionality from workspace */
	
	var main = Oskari.clazz.create('Oskari.paikkatietoikkuna.standalone.Main');
	main.start();

});
