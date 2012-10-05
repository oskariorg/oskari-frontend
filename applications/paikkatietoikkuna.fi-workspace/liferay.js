Oskari.clazz.define('Oskari.paikkatietoikkuna.standalone.Main', function() {
	this.appSetup = null;
	this.appConfig = null;
}, {
	downloadConfig : function(notifyCallback) {
		var me = this;
		jQuery.ajax({
			type : 'GET',
			dataType : 'json',
			url : 'liferay-config.json',
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
	downloadAppSetup : function(notifyCallback) {
		var me = this;
		jQuery.ajax({
			type : 'GET',
			dataType : 'json',
			url : 'liferay-appsetup.json',
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
	startBaseBundles: function() {
		// check that both setup and config are loaded
		// before actually starting the application
		var me = this;
		if(!( me.appSetup && me.appConfig) ) {
			return;
		}
		
		var app = Oskari.app;
		app.setApplicationSetup(me.appSetup);
		app.setConfiguration(me.appConfig);
		app.startApplication(function(startupInfos) {
				// all bundles have been loaded
				me.startAdditionalBundles();
		});
	},
	start : function() {
		var me = this;

		me.downloadAppSetup(function() {
			me.startBaseBundles();
		});
		me.downloadConfig(function() {
			me.startBaseBundles();
		});
	},
	
	
	startAdditionalBundles : function() {
		var me = this;

		/* from now on, let's play locally */
		Oskari.setPreloaded(false);
		Oskari.setBundleBasePath('../');

		/* we now have The Sandbox (instantiated in mapfull) which will be used to dispatch request and events */
		var sandbox = Oskari.$("sandbox");

		/* 1st launch divman ( see below )*/
		Oskari.bundle_facade.playBundle(me.configs.divman, function() {

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

		});
	},
	
	configs : {
		divman : {
			"title" : "Oskari DIV Manazer",
			"en" : "Oskari DIV Manazer",
			"fi" : "Oskari DIV Manazer",
			"sv" : "Oskari DIV Manazer",
			"bundleinstancename" : "divmanazer",
			"bundlename" : "divmanazer",
			"instanceProps" : {  },
			"metadata" : {
				"Import-Bundle" : {
					"divmanazer" : {
						"bundlePath" : "../../packages/framework/bundle/"
					}
				},
				"Require-Bundle-Instance" : []
			}
		},
		bundles : [{
			"title" : "My3rd",
			"en" : "My3rd",
			"fi" : "My3rd",
			"sv" : "My3rd",
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
			"title" : "My3rd",
			"en" : "My3rd",
			"fi" : "My3rd",
			"sv" : "My3rd",
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
			"title" : "My3rd",
			"en" : "My3rd",
			"fi" : "My3rd",
			"sv" : "My3rd",
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
			"title" : "My3rd",
			"en" : "My3rd",
			"fi" : "My3rd",
			"sv" : "My3rd",
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
			"title" : "My3rd",
			"en" : "My3rd",
			"fi" : "My3rd",
			"sv" : "My3rd",
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
			"title" : "My3rd",
			"en" : "My3rd",
			"fi" : "My3rd",
			"sv" : "My3rd",
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
			"title" : "My3rd",
			"en" : "My3rd",
			"fi" : "My3rd",
			"sv" : "My3rd",
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
			"title" : "My3rd",
			"en" : "My3rd",
			"fi" : "My3rd",
			"sv" : "My3rd",
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

	bundleConfigurationReady : function() {

		Oskari.$("sandbox").findRegisteredModuleInstance('catalogue.bundle.metadataflyout').loader.dev = true
		Oskari.$("sandbox").postRequestByName('InfoBox.ShowInfoBoxRequest', ['jexp', 'JEP', [{
			html : "<div><br />x<br />x</div>"
		}], Oskari.$("sandbox").findRegisteredModuleInstance("MainMapModule").getMap().getCenter(), true])
	}
});

jQuery(document).ready(function() {
	Oskari.setLang('fi');
	Oskari.setLoaderMode('dev');
	Oskari.setPreloaded(true);
	Oskari.setBundleBasePath('../');
	var main = Oskari.clazz.create('Oskari.paikkatietoikkuna.standalone.Main');
	main.start();

});
