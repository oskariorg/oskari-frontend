/**
 * @class Oskari.poc.kendo.KendoSample
 *
 * Sample embedding (almost only OpenLayers) map to kendoui
 *
 * /samples/kendoui/index.html?oskariLoaderMode=yui&style=style1&zoomLevel=8&coord=528574_6759496&mapLayers=base_35+100+!default!,90+100+&showMarker=false&forceCache=true
 *
 */
Oskari.clazz.define('Oskari.poc.kendo.KendoSample', function() {

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
	 * starts the bundles defined in appSetup.startupSequence
	 * property
	 *
	 */
	start : function() {

		var me = this;

		Oskari.setLoaderMode('yui');

		var appSetup = this.appSetup;
		var app = Oskari.app;

		app.setApplicationSetup(appSetup);
		app.startApplication(function(startupInfos) {
			me.instance = startupInfos.bundlesInstanceInfos['kendoui'].bundleInstance;
		}, {});

	},
	/**
	 * @static
	 * @property appSetup.startupSequence
	 */
	appSetup : {
		startupSequence : [
		/* OpenLayers */
		{
			/*callback : function() {
			 Oskari.setLoaderMode('dev');
			 },*/
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
		},
		/* App */
		{
			title : 'Map',
			fi : 'Map',
			sv : '?',
			en : 'Map',
			bundlename : 'kendoui',
			bundleinstancename : 'kendoui',
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
						bundlePath : '../../packages/tools/bundle/'
					},

					/*
					 * "minimal" : { bundlePath :
					 * '../example-bundles/bundle/' }
					 */

					"kendoui" : {
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
