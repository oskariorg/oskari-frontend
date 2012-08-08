/**
 * @class Oskari.samples.yuilibrary.Main
 *
 * Launcher Class for a sample featuring yuilibrary.js and 960 layout
 *
 */
Oskari.clazz.define('Oskari.samples.yuilibrary.Main', function() {

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
	 * starts the application with bundle definitions declared
	 * in property appSetup.startupSequence
	 */
	start : function() {

		var me = this;

		/** use sample bundle to fire the engine * */
		var appSetup = this.appSetup;
		var app = Oskari.app;

		app.setApplicationSetup(appSetup);
		app.startApplication(function(startupInfos) {
			var bi = startupInfos.bundlesInstanceInfos['yuilibrary'].bundleInstance;
			bi.getSandbox().postRequestByName('MapMoveRequest',
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

			/*callback: function() {
			 Oskari.setLoaderMode('dev');
			 },*/

			title : '960',
			fi : '960',
			sv : '?',
			en : '960',
			bundlename : 'openlayers-default-theme',
			bundleinstancename : 'openlayers-default-theme',
			metadata : {
				"Import-Bundle" : {
					"openlayers-map" : {
						bundlePath : '../openlayers/bundle/'
					},
					"openlayers-default-theme" : {
						bundlePath : '../openlayers/bundle/'
					},
					"style1" : {
						bundlePath : 'bundle/'
					}

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
		 *
		 * app
		 */
		{
			title : 'Map',
			fi : 'Map',
			sv : '?',
			en : 'Map',
			bundlename : 'yuilibrary',
			bundleinstancename : 'yuilibrary',
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
					"request-base" : {
						bundlePath : '../../packages/framework/bundle/'
					},
					"request-map" : {
						bundlePath : '../../packages/framework/bundle/'
					},
					"request-map-layer" : {
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

					"mapmodule-core" : {
						bundlePath : '../../packages/framework/bundle/'
					},
					"yuilibrary" : {
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
			title : 'Extensions',
			fi : 'Extensions',
			sv : '?',
			en : 'Extensions',
			bundlename : 'layerselection',
			bundleinstancename : 'layerselection',
			metadata : {
				"Import-Bundle" : {
					"layerselection" : {
						bundlePath : 'bundle/'
					}

				},
				"Require-Bundle-Instance" : []

			},
			instanceProps : {

			}
		}]
	}

});

$(document).ready(function() {

	$("#accordion").accordion();

	var args = {
		oskariLoaderMode : 'yui'
	};

	if(args.oskariLoaderMode)
		Oskari.setLoaderMode(args.oskariLoaderMode);
	else

		Oskari.setLoaderMode('yui');
	if(args.oskariLoaderAsync && args.oskariLoaderAsync == 'on') {
		Oskari.setSupportBundleAsync(true);
	}

	var main = Oskari.clazz.create('Oskari.samples.yuilibrary.Main');
	main.processArgs(args);
	main.start();
});
