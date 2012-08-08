/**
 * @class Oskari.samples.jqueryui.Main
 *
 * Launcher Class for a sample featuring jqueryui.js and 960 layout
 *
 * /samples/jqueryui/index.html?oskariLoaderMode=yui&style=style1&zoomLevel=8&coord=528574_6759496&mapLayers=base_35+100+!default!,90+100+&showMarker=false&forceCache=true
 *
 */
Oskari.clazz.define('Oskari.samples.jqueryui.Main', function() {

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
			me.instance = startupInfos.bundlesInstanceInfos['jqueryui'].bundleInstance;
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

			callback : function() {
				Oskari.setLoaderMode('dev');
			},
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
			bundlename : 'jqueryui',
			bundleinstancename : 'jqueryui',
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
					"jqueryui" : {
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

	var main = Oskari.clazz.create('Oskari.samples.jqueryui.Main');
	main.processArgs(args);
	main.start();
});
