Oskari.clazz.define("Oskari.mapframework.bundle.QuickStartGuideBundleInstance",
		function() {
			this.map = null;
			this.mapster = null;
			this.ui = null;
		}, {
			/*
			 * @method returns ui manager
			 */
			getUserInterface : function() {
				return this.getApp().getUserInterface();
			},
			getApp: function() {
				return this.app;
			},
			/**
			 * @method implements BundleInstance start methdod
			 * 
			 */
			"start" : function() {
				
				var args = null;
				if (document.location.search.length > 1) {
					args = Ext.urlDecode(document.location.search
							.substring(1));
				} else {
					args = {};
				}

				/**
				 * 1) Create Application Instance (this class is loaded
				 * 'staticly')
				 */
				var app = Oskari.clazz
						.create('Oskari.mapframework.quickstartguide.Sample');
				this.app = app;
				
				/**
				 * 2) Create Bundle Configuration (this class is loaded
				 * 'staticly')
				 * 
				 */
				/**
				 * 3) Create Map Configuration & configure app with some
				 * default map selections (this class is loaded
				 * 'staticly')
				 */
				var layers = Oskari.clazz
						.create(
								'Oskari.mapframework.complexbundle.NlsFiLayerConfig',
								{
									default_wms_url : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?"
								});

				var mapConfiguration = layers.create();

				/**
				 * & tell app about the configuration
				 */
				app.setMapConfiguration(mapConfiguration);

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


			
			},
			
			/**
			 * @method update
			 * 
			 * implements bundle instance update method
			 */
			"update" : function() {

			},
			
			/**
			 * @method stop
			 * 
			 * implements bundle instance stop method
			 */
			"stop" : function() {
				alert('Stopped!');
			}
		}, {
			"protocol" : [ "Oskari.bundle.BundleInstance" ]
		});
