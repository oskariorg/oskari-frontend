Oskari.clazz
		.define(
				"Oskari.mapframework.bundle.Candy2BundleInstance",
				function() {
					this.map = null;
					this.mapster = null;
					this.ui = null;
					this.sandbox = null;
				},
				{

					/*
					 * @method returns ui manager
					 */
					getUserInterface : function() {
						return this.ui;
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
								.create('Oskari.mapframework.candy-2.Sample');
						

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
										'Oskari.mapframework.wmts.NlsFiLayerConfig',
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

						/**
						 * & let's load (a lot of) core classes using default
						 * bundle definitions
						 */

						app.startFramework();

						/* These will need an UI Facade implementation */
						// core.processRequest(core.getRequestBuilder('AddMapLayerRequest')('base_27',false));
						/*
						 * core.processRequest(core.getRequestBuilder('MapMoveRequest')(
						 * 545108, 6863352, 5,false));
						 */
						this.app = app;

					},

					getApp : function() {
						return this.app;
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