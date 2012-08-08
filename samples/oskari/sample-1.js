Oskari.clazz.define('Oskari.framework.oskari.Sample1', function() {

}, {

	/**
	 *
	 */

	/**
	 * @method start
	 *
	 */
	start : function() {

		if(location.search.indexOf('oskariLoaderMode=yui') != -1) {
			Oskari.setLoaderMode('yui');
		}
		if(location.search.indexOf('oskariLoaderAsync=on') != -1) {
			Oskari.setSupportBundleAsync(true);
		}

		var me = this;

		Oskari.setLoaderMode('yui');

		var appSetup = this.appSetup;
		var app = Oskari.app;

		app.setApplicationSetup(appSetup);
		app.startApplication(function(startupInfos) {
			me.instance = startupInfos.bundlesInstanceInfos['sample-1'].bundleInstance;

		}, {});

	},
	appSetup : {
		startupSequence : [{
			title : 'OpenLayers with Proj4',
			fi : 'OpenLayers with Proj4',
			sv : '?',
			en : 'OpenLayers with Proj4',
			bundlename : 'openlayers-map',
			bundleinstancename : 'openlayers-map',
			metadata : {
				"Import-Bundle" : {
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
			}
		}, {
			title : 'Map',
			fi : 'Map',
			sv : '?',
			en : 'Map',
			bundlename : 'sample-1',
			bundleinstancename : 'sample-1',
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

					"sample-1" : {
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
	}
});

Oskari.clazz.create('Oskari.framework.oskari.Sample1').start();
