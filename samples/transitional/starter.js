/**
 *
 */
Oskari.clazz.define('Oskari.mapframework.transitional.Starter', function() {
}, {
	start : function() {

		var me = this;

		me.startOpenLayers();
	},
	/**
	 *
	 */
	startOpenLayers : function() {

		var me = this;

		var def = {
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
		};

		/** use sample bundle to fire the engine * */
		Oskari.bundle_facade.playBundle(def, function(bi) {
			me.startFramework();
		});
	},
	startFramework : function() {
		var me = this;
		var args = null;
		if(location.search.length > 1) {
			args = Ext.urlDecode(location.search.substring(1));
		} else {
			args = {};
		}
		/**
		 * 0) some entertainment for startup
		 */
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

		/**
		 * 1) Create Application Instance (this class is loaded
		 * 'staticly')
		 */
		var app = Oskari.clazz.create('Oskari.mapframework.transitional.Sample');

		/**
		 * 2) Create Bundle Configuration (this class is loaded
		 * 'staticly')
		 *
		 */
		var bundles = Oskari.clazz.create('Oskari.mapframework.transitional.Config');

		/**
		 * & adjust some paths
		 */
		bundles.setBundlePaths({
			'core-bundle' : "../../packages/framework/bundle/",
			'application' : "bundle/",
			'portal' : "../portal/bundle/"
		});

		/**
		 * & configure some bundles
		 */
		var baseBundleDefinition = bundles.getBaseBundleDefinition();
		var appBundleDefinition = bundles.getStartupBundleDefinition(args);

		/**
		 * 3) Create Map Configuration & configure app with some
		 * default map selections (this class is loaded
		 * 'staticly')
		 */
		var layers = Oskari.clazz.create('Oskari.mapframework.default.NlsFiLayerConfig', {
			default_wms_url : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?"
		});

		var mapConfiguration = layers.create();

		/**
		 * & tell app about the configuration
		 */
		app.setMapConfiguration(mapConfiguration);
		app.setBundleConfiguration(baseBundleDefinition, appBundleDefinition);

		/**
		 * 4) Store some 'globals' for mapframework & set config
		 * to global that's used by the framework until some
		 * refactoring will take place 2011-IV
		 */

		Oskari.$("pageArgs", args);
		Oskari.$("startup", layers.getMapConfiguration());
		Oskari.$("Ext", Ext);

		/**
		 * 5) start the Application Instance a) baseline b) app
		 * c) app bundles (all remaining classes are loaded
		 * dynamically in this demo)
		 */

		/**
		 * & some load status preparations
		 */
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
		/**
		 * & let's load (a lot of) core classes using default
		 * bundle definitions
		 */
		app.createBaseBundles(function() {

			app.startFramework();

			/* These will need an UI Facade implementation */
			app.startApplicationBundles(function() {
				Ext.MessageBox.hide();

			});
		});

		window.app = app;

	}
});
