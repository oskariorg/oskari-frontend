Oskari.clazz.define('Oskari.framework.oskari.KPI', function() {

}, {
	getInstance : function() {
		return this.instance;
	},
	pan : function(offx, offy) {
		var mapmodule = this.getInstance().getMapModule();
		var size = mapmodule.getMap().getSize();
		var pixoffx = offx * size.w;
		var pixoffy = offy * size.w;

		mapmodule.panMapByPixels(pixoffx, pixoffy);
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

		Oskari.setLoaderMode('yui');

		var appSetup = this.appSetup;
		var app = Oskari.app;

		app.setApplicationSetup(appSetup);
		app.startApplication(function(startupInfos) {
			me.instance = startupInfos.bundlesInstanceInfos['kpI'].bundleInstance;
			window.startupInfos = startupInfos;
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
			bundlename : 'kpI',
			bundleinstancename : 'kpI',
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
					"mapmodule-core" : {
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

					"yui" : {
						bundlePath : '../tools/bundle/'
					},

					/*
					 * "minimal" : { bundlePath : '../example-bundles/bundle/' }
					 */

					"kpI" : {
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
		}]
	}
});

Oskari.$("KPI", Oskari.clazz.create('Oskari.framework.oskari.KPI'));
Oskari.$("KPI").start();
