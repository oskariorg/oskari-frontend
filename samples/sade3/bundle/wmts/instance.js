Oskari.clazz
		.define(
				"Oskari.mapframework.bundle.WmtsBundleInstance",
				function() {
					this.map = null;
					this.mapster = null;
					this.mapmodule = null;

					this.ui = null;
					this._uimodules = [];
					this._uimodulesByName = {};

				},
				{
					
					addExtensionModule : function(module, identifier,
							regionDef, loc, comp) {
						var def = {
							module : module,
							identifier : identifier,
							region : regionDef,
							loc : loc,
							component : comp
						};
						this._uimodules.push(def);
						this._uimodulesByName[identifier] = def;

						return def;
					},

					/**
					 * @method createModulesAndUi
					 * 
					 * implements UserInterfaceManager protocol
					 */
					createModulesAndUi : function(sandbox) {
						var showIndexMap = true;
						var showZoomBar = true;
						var showScaleBar = true;
						var allowMapMovements = true;

						/**
						 * Map
						 * 
						 */
						var mapmodule = Oskari.clazz
								.create(
										'Oskari.mapframework.ui.module.common.MapModule',
										"Main", showIndexMap, showZoomBar,
										showScaleBar, allowMapMovements);
						mapmodule.setOpts({
					        createMap : true,
					        createMapSketchLayer : false,
					        createMapMarkersLayer : false,
					        createMapVectorLayer : false,
					        createMapMoveHandlers : true,
					        addMapControls : true,
					        registerVectorFormats : false,
					        createMapPanel : true,
					        createTilesGrid : false,
					        'WfsLayerPlugin' : false,
					        'GetInfoPlugin' : true
					    });
						
						/**
						 * Hack resolutions
						 */
						mapmodule.createMap = function() {

					        var sandbox = this._sandbox;

					        var lonlat = new OpenLayers.LonLat(sandbox.getMap().getX(), sandbox.getMap().getY());
					        this._map = new OpenLayers.Map({
					        	 projection : this._projectionCode,
					        	 center : lonlat,
					             zoom : sandbox.getMap().getZoom(),
								units : "m",
					            controls : [new OpenLayers.Control()],
								resolutions : [
								        
								        // PTI mukaiset
								        2000,1000,500,200,100,50,20,10,4,2,1,0.5,0.25

										// JHS mukaiset
										// 4096, 2048, 1024, 512, 256, 128, 64,
										// 32,
										// 16, 8, 4, 2, 1, 0.5, 0.25
								],
								maxExtent : new OpenLayers.Bounds(-548576, 6291456,
										1548576, 8388608),
										theme: null
							});

					        return this._map;
					    };
						
						this.mapmodule = mapmodule;

						/**
						 * This creates the Map Implementation (OpenLayers.Map)
						 * returned from module.init() (by design from 2010...)
						 */
						var map = sandbox.register(mapmodule);
						this.map = map;

						/**
						 * Mapster container for the Map in ExtJS4 Panel
						 */
						
						var mapster = Ext.createWidget('nlsfimappanel', {
							olmap : map,
							layout : 'absolute',
							flex : 1
						});

						/**
						 * Map Controls !Note!: MapControls assumes main map to
						 * be called 'Main'
						 */
						var mapcontrolsmodule = Oskari.clazz
								.create('Oskari.mapframework.ui.module.common.MapControlsModule');
						var mapcontrols = sandbox.register(mapcontrolsmodule);

						mapster.add(mapcontrols);
						

						/**
						 * UI Panelstry for the UI
						 */

						var pnl = Ext.create('Ext.panel.Panel', {
							layout : 'fit',
							title : 'Map',
							items: [mapster]
						});

						var container = Ext
								.create(
										'Ext.panel.Panel',
										{
											region : 'center',
											layout : 'accordion',
											layoutConfig : {
												
												titleCollapse : false,
												animate : true,
												activeOnTop : true
											},
											defaults : {
												bodyStyle : 'padding:15px;background-color: #bbeeff;'
											},
											items : [ pnl, {
												title : 'Another Panel',
												html : 'Sample content'
											} ],
											title : 'Ext Window'
										});

						

						/**
						 * Viewport
						 */

						/*
						 * Ext.create('Ext.container.Viewport', { style : {
						 * padding : '8px', overflow : 'hidden' }, layout :
						 * 'fit', items : [ pnl ] });
						 */
						var ui = Ext.create('Ext.window.Window', {
							style : {
								padding : '8px',
								overflow : 'hidden'
							},
							layout : 'fit',
							items : [ container ],
							width : 1024,
							height : 768,
							title : 'ExtJS4 Window'
						});

						this.ui = ui;
						
						this._facade = Oskari.clazz
						.create(
								'Oskari.mapframework.oskari.ui.WmtsFacade',
								sandbox,
								this,
								{
									'Drawer' : {},
									'Center' : container,
									'E' : container,
									'W' : container,
									'NW' : container
								});
						
						
						/**
						 * Let's create a map plugin for WMTS
						 */
					
						/*var bundlePath = this.mediator.manager.stateForBundleDefinitions['wmts'].bundlePath;
						// Oskari.bundle_facade.bundlePath;
						//var capsPath = bundlePath+"/wmtsfixed.xml";
						var capsPath = bundlePath+"/wmts-3.xml";
						
						var wmtsPlugin = Oskari.clazz.create('Oskari.mapframework.mapmodule.WmtsPocPlugin',{
							capsPath: capsPath
						});
						this.wmtsPlugin = wmtsPlugin;
						mapmodule.registerPlugin(wmtsPlugin);
						mapmodule.startPlugin(wmtsPlugin);
						 */
						

				/**
				 * TEMP hack
				 */
				Oskari.$("UI.facade", this._facade);
				
				

						
					},

					/**
					 * @method implements BundleInstance start methdod
					 * 
					 */
					"start" : function() {
						var me = this;
						if( me.started) 
							return;
						me.started = true;

						/**
						 * creating core and sandbox
						 */
						var core = Oskari.clazz
						.create('Oskari.mapframework.core.Core');
						this.core = core;
						var sandbox = core.getSandbox();
						
						
						/**
						 * Setting up sample configuration for layers etc.
						 */
						var layers = Oskari.clazz
								.create('Oskari.mapframework.wmts.NlsFiLayerConfig');
						this.layers = layers;
						var conf = layers.create();
						var startup = conf;

						Oskari.$("startup", conf);
						
						
						/**
						 * creating services
						 */
						var userInterfaceLanguage = "fi";

						var mapLayerService = Oskari.clazz.create(
								'Oskari.mapframework.service.MapLayerService',
								null,sandbox);
						
						var services = [];
						services.push(Oskari.clazz.create(
								'Oskari.mapframework.service.LanguageService',
								userInterfaceLanguage));
						services.push(mapLayerService);
						
						/**
						 * Setting up WMTS support
						 */
				       
				        /*
						 * We'll register a handler for our type
						 */
				        mapLayerService.registerLayerModel('wmtslayer','Oskari.mapframework.wmts.domain.WmtsLayer')
				        
				        var layerModelBuilder = 
				        	Oskari.clazz.create('Oskari.mapframework.wmts.service.WmtsLayerModelBuilder');
				        
				        mapLayerService.registerLayerModelBuilder('wmtslayer',layerModelBuilder);
				        
				        /**
						 * We'll need WMTSLayerService
						 */
				        var wmtsService = Oskari.clazz.create('Oskari.mapframework.wmts.service.WMTSLayerService',mapLayerService);
				        this.wmtsService  = wmtsService ;

					

				        /**
				         * Launching the framework
				         * 
				         */
						var enhancements = [];

						var uimanager = me;

					
						core.init(uimanager, services, enhancements,
										conf.layers, userInterfaceLanguage,
										null, false);
			
						/**
						 * Showing the UI now
						 */

						
						this.ui.show();
						
						/*
						 * Adding some more functionality for WMTS 
						 * a WMTS plugin to mapmodule
						 */
						
						var mapmodule = sandbox
						.findRegisteredModuleInstance('MainMapModule');

						var wmtsPlugin = Oskari.clazz
						.create('Oskari.mapframework.wmts.mapmodule.plugin.WmtsLayerPlugin');
						mapmodule
						.registerPlugin(wmtsPlugin);
						mapmodule
						.startPlugin(wmtsPlugin);
					

						/**
						 * Loading some WMTS layers also for basemaps
						 */

						var manager = this.mediator.manager;
						var bundlePath = manager.stateForBundleDefinitions['wmts'].bundlePath;
						// Oskari.bundle_facade.bundlePath;
						var capsPath = bundlePath
							+ "/geowebcache-wmts-zoom-no-zoom.xml";
							//+ "/geowebcache-wmts-limits-extent-fixed.xml";

				
						wmtsService
							.readWMTSCapabilites(
								'jkorhonen',
								capsPath,
								"EPSG_3067_PTI");						
						
						// core.processRequest(core.getRequestBuilder('AddMapLayerRequest')('base_27',true,true));
						core.processRequest(core.getRequestBuilder('MapMoveRequest')(
						  545108, 6863352, 5,false));
						

						
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
