Oskari.clazz.define('Oskari.framework.oskari.Print', function() {

}, {

	/**
	 *
	 */

	/**
	 * @method start
	 *
	 */
	start : function() {

		var me = this;

		if(location.search.indexOf('oskariLoaderMode=yui') != -1) {
			Oskari.setLoaderMode('yui');
		}
		if(location.search.indexOf('oskariLoaderAsync=on') != -1) {
			Oskari.setSupportBundleAsync(true);
		}

		var layers = Oskari.clazz.create('Oskari.mapframework.complexbundle.NlsFiLayerConfig');
		this.layers = layers;
		var conf = layers.create();
		startup = conf;

		Oskari.$("startup", conf);

		/**
		 * Let's start bundle named 'print'
		 */

		var def = {
			title : 'Map',
			fi : 'Map',
			sv : '?',
			en : 'Map',
			bundlename : 'mapprint',
			bundleinstancename : 'mapprint',
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
					"service-map-full" : {
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
					"openlayers-map" : {
						bundlePath : '../openlayers/bundle/'
					},
					"mapprint" : {
						bundlePath : '../../packages/framework/bundle/'
					},
					"mapwmts" : {
						bundlePath : '../../packages/framework/bundle/'
					},
					"yui" : {
						bundlePath : '../tools/bundle/'
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
		};

		/** use sample bundle to fire the engine * */
		Oskari.bundle_facade.playBundle(def, function() {

			/**
			 * up and running - app specific code in bundle/print/bundle.js
			 */

		});
	}
});

Oskari.clazz.create('Oskari.framework.oskari.Print').start();
