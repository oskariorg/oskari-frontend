/**
 * @class Oskari.samples.adapt.Main
 *
 * Launcher Class for a sample featuring adapt.js and 960 layout
 *
 */
Oskari.clazz.define('Oskari.samples.adapt.Main', function() {

	this.args = null;
	this.styleBndl = null;
}, {
	processArgs : function(args) {
		this.args = args;
		this.styleBndl = args.style;
	},
	/**
	 *
	 */

	/**
	 * @method start
	 *
	 * starts the application with bundle definitions declared in property
	 * appSetup.startupSequence
	 */
	start : function() {

		var me = this;

		/** use sample bundle to fire the engine * */
		var appSetup = this.appSetup;
		var app = Oskari.app;

		app.setApplicationSetup(appSetup);
		app.startApplication(function(startupInfos) {
			var bi = startupInfos.bundlesInstanceInfos['adapt'].bundleInstance;
			bi.getApp().getSandbox().postRequestByName('MapMoveRequest',
			/*
			 * [ 385576, 6675364, 8, false ]);
			 */
			[422780, 6851190, 1, false]);
		});
	},
	/**
	 * @static
	 * @property appSetup.startupSequence
	 *
	 */
	appSetup : {

		startupSequence : [
		/* openlayers */
		{
			/*
			 * callback: function() { Oskari.setLoaderMode('dev'); },
			 */
			title : '960',
			fi : '960',
			sv : '?',
			en : '960',
			bundlename : 'ns960',
			bundleinstancename : 'ns960',
			metadata : {
				"Import-Bundle" : {
					"ns960" : {
						bundlePath : 'bundle/'
					},
					"openlayers-map" : {
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

			},
			instanceProps : {

			}
		},

		/*
		 *
		 * app
		 */
		{
			title : 'Map',
			fi : 'Map',
			sv : '?',
			en : 'Map',
			bundlename : 'adapt',
			bundleinstancename : 'adapt',
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
					"request-base" : {
						bundlePath : '../../packages/framework/bundle/'
					},
					"request-map" : {
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
					"mapmodule-core" : {
						bundlePath : '../../packages/framework/bundle/'
					},

					"mapcontrols" : {
						bundlePath : '../../packages/framework/bundle/'
					},
					"adapt" : {
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
		}, {
			title : 'Map',
			fi : 'Map',
			sv : '?',
			en : 'Map',
			bundlename : 'positioninfo',
			bundleinstancename : 'positioninfo',
			metadata : {
				"Import-Bundle" : {
					"layerhandler" : {
						bundlePath : '../../packages/framework/bundle/'
					},
					"mapoverlaypopup" : {
						bundlePath : '../../packages/framework/bundle/'
					},

					"positioninfo" : {
						bundlePath : '../quickstartguide/bundle/'
					},
					"wikipedia" : {
						bundlePath : '../quickstartguide/bundle/'
					}

				},
				"Require-Bundle-Instance" : ["layerhandler", "mapoverlaypopup", "wikipedia"]

			},
			instanceProps : {

			}
		}]
	},

	/**
	 * @method applyStyleBundle
	 * applies style bunde from Query Args ?style=<style-bundle-name>
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

	var main = Oskari.clazz.create('Oskari.samples.adapt.Main');
	main.processArgs(args);
	main.applyStyleBundle();
	main.start();
});
