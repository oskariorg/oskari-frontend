/**
 * @class Oskari.mapframework.ui.manager.mapportal.Facade
 * 
 * Facade to support extension module lifecycle operations.
 * 
 * Extension bundles and modules can be registered on application startup or
 * later dynamically.
 * 
 * !UNFINISHED!
 * 
 * Parts Map is like this { 'Portlet' : { 'W' : westPortalPanel, 'E' :
 * eastPortalPanel }, 'Drawer' : { 'W' : westPanel, 'E' : eastPanel }, 'S' :
 * southPanel, 'NW' : northWestPanel, 'Center' : centerPanel, 'Viewport' :
 * viewport, 'ViewportCenter' : viewportCenterPanel, 'StatusRegion' :
 * statusDocked }
 * 
 */
/*
 * @class Oskari.mapframework.ui.manager.mapportal.MapPortalUiManager
 * 
 * Portal kind of User Interface Manager for modules and bundles.
 * 
 * 
 */
Oskari.clazz
		.define(
				'Oskari.mapframework.ui.manager.adapt.AdaptUiManager',

				/**
				 * @constructor
				 * 
				 * Creates an UI Manager manager for Portlet oriented UI
				 * 
				 */
				function(conf) {

					/** Sandbox */
					this._sandbox;

					/** configuration for this ui manager * */
					this._conf = conf;

					/** Top level ext component that represents overlay popup */
					/** Map controls dom */
					/** ui modules * */
					this._uimodules = [];
					this._uimodulesByName = {};

					this.facadeParts = {
						'Portlet' : {},
						'Drawer' : {}
					};

				},
				{

					/**
					 * @method createModulesAndUi
					 * 
					 * Map framework callback
					 * 
					 * Creates actual modules and ui
					 * 
					 * @param {Object}
					 *            sandbox
					 */
					createModulesAndUi : function(sandbox) {
						sandbox.printDebug("Creating UI for Map full...");
						this._sandbox = sandbox;

						var conf = this._conf;

						/* setup core ui modules */
						/**
						 * Map
						 * 
						 */
						var showIndexMap = false;
						var showZoomBar = true;
						var showScaleBar = true;
						var allowMapMovements = true;

						var mapmodule = Oskari.clazz
								.create(
										'Oskari.mapframework.ui.module.common.MapModule',
										"Main", showIndexMap, showZoomBar,
										showScaleBar, allowMapMovements);
						
						/*mapmodule.setOpts( {
							createMap : true,
							createMapSketchLayer : false,
							createMapMarkersLayer : false,
							createMapVectorLayer : false,
							createMapMoveHandlers : true,
							addMapControls : true,
							registerVectorFormats : true,
							createMapPanel : true,
							createTilesGrid : false,
							'WfsLayerPlugin' : false,
							'GetInfoPlugin' : true
						});*/
						
					
						
						this.mapmodule = mapmodule;
						

						/**
						 * This creates the Map Implementation (OpenLayers.Map)
						 * returned from module.init() (by design from 2010...)
						 */
						var map = sandbox.register(mapmodule);
						this.map = map;
						
						/**
						 * plugins
						 */
						var plugins = [];
						plugins.push('Oskari.mapframework.bundle.mapmodule.plugin.LayersPlugin');
						plugins.push('Oskari.mapframework.mapmodule.WmsLayerPlugin');
				        plugins.push('Oskari.mapframework.mapmodule.ControlsPlugin');
						
				        for(var i = 0; i < plugins.length; i++) {
				            var plugin = Oskari.clazz.create(plugins[i]);
				            mapmodule.registerPlugin(plugin);
				        } 
						
						/**
						 * should create a plugin for this
						 */
						map.addControl(new OpenLayers.Control.TouchNavigation({
		                dragPanOptions: {
		                    enableKinetic: true
		                }}));

						/* extension modules */
						this.setupExtensionModules(sandbox);
						/*
						 * Modules created, next build up EXTjs Frame and fit
						 * modules to that. Yes, it is that simple.
						 */
						sandbox
								.printDebug("All modules created, next build up EXTJs frame...");
						this.createUi(sandbox);
						sandbox
								.printDebug("Map full UI construction completed.");
					},

					/**
					 * @method setupExtensionModules
					 * @private
					 * 
					 * Let's register module to sandbox (internal)
					 */
					setupExtensionModules : function(sandbox) {
						sandbox.printDebug("setupExtensionModules...");

						for ( var n = 0; n < this._uimodules.length; n++) {
							var def = this._uimodules[n];
							if (!def.module)
								continue;
							sandbox.printDebug("#*+---- registering ----+*#"
									+ def.identifier);

							def.component = sandbox.register(def.module);

						}
					},

					/**
					 * @method addExtensionModule
					 * 
					 * @param regionDef
					 *            Region options Center, W, S, E, NW, Mapster,
					 *            ...
					 * 
					 * interface to add extension module to ui
					 */
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
					 * @method getExtensionModule Returns extension ui module by
					 *         name
					 */
					getExtensionModule : function(identifier) {
						return this._uimodulesByName[identifier].module;
					},

					/**
					 * @method getExtensionModuleDefinition
					 */
					getExtensionModuleDefinition : function(identifier) {
						return this._uimodulesByName[identifier];
					},

					/*
					 * @method getExtensionModuleComponentsByRegion * Returns
					 * extension ui components by region def { 'NW' : true, 'N':
					 * true ... }
					 */
					getExtensionModuleComponentsByRegion : function(
							regionSelector) {
						var sandbox = this._sandbox;
						var results = [];
						var dbgStr = "";
						for (p in regionSelector) {
							dbgStr += p + "=" + regionSelector[p] + " ";
						}
						sandbox
								.printDebug("getExtensionModulesByRegion called with "
										+ dbgStr);
						for ( var n = 0; n < this._uimodules.length; n++) {
							var def = this._uimodules[n];
							if (!def.component)
								continue;
							if (regionSelector[def.region]) {
								results.push(def.component);
								sandbox.printDebug("- module " + def.identifier
										+ " matched");
							}
						}

						return results;
					},

					/**
					 * @method getExtensionModuleDefinitionsByRegion
					 * 
					 * Returns extension ui modules by region def { 'NW' : true,
					 * 'N': true ... }
					 */
					getExtensionModuleDefinitionsByRegion : function(
							regionSelector) {
						var results = [];
						for ( var n = 0; n < this._uimodules.length; n++) {
							var def = this._uimodules[n];
							if (regionSelector[def.region])
								results.push(def);
						}

						return results;
					},

					/**
					 * @method createUi
					 * 
					 * MapFramework callback
					 * 
					 * Constructs EXTJs Frame and inserts modules into that.
					 */
					createUi : function(sandbox) {

						var lang = sandbox.getLanguage();

						var mapConfigurations = Oskari.$().startup.mapConfigurations;

						/**
						 * Build UI
						 */

						this.map.render('map-div');

						/**
						 * UI EAST
						 */

						var eastPanel = this.createPortletPanel(sandbox,
								mapConfigurations, 'east', 'E', 512);
						var westPanel = this.createPortletPanel(sandbox,
								mapConfigurations, 'west', 'W', 512);
						var southPanel = this.createPortletPanel(sandbox,
								mapConfigurations, 'south', 'S', 256);

						/**
						 * Publish UI parts as Facade
						 */
						this._facade = Oskari.clazz.create(
								'Oskari.mapframework.ui.manager.adapt.Facade',
								sandbox, this, this.facadeParts);

						/**
						 * TEMP hack
						 */
						Oskari.$("UI.facade", this._facade);

						this._uiReady = true;

					},

					/**
					 * @method getFacade
					 */
					getFacade : function() {
						return this._facade;
					},

					createPortletPanel : function(sandbox, mapConfigurations,
							divId, regionSelector) {

						/*
						 * Hacks
						 */
						var containerEl = Ext.get(divId);
						var width = containerEl.getWidth();
						var height = containerEl.getHeight();
						
						var regions = {};
						regions[regionSelector] = true;

						var portletItems = this
								.getExtensionModuleDefinitionsByRegion(regions);

						var portletPortletItems = [];
						for ( var n = 0; n < portletItems.length; n++) {
							var def = portletItems[n];
							portletPortletItems.push( {
								title : def.loc ? def.loc[lang].title : '?',
								height : 256,
								items : def.component
							});
						}

						var portletPortalPanel = Ext.create(
								'Ext.app.PortalPanel', {
									xtype : 'portalpanel',
									items : [ {
										// id : 'col-2',
									items : portletPortletItems
								} ]
								});

						var portletPortlets = [ portletPortalPanel ];

						// Explicitly create a Container
						var portletPanel = Ext.create('Ext.container.Container', {
							layout : {
								type : 'fit'
							},
							renderTo : containerEl,
							height: height,
							border : 1,
							style : {
								width : '100%',
								height : '100%'
							},

							items : portletPortlets
						});

						this.facadeParts['Portlet'][regionSelector] = portletPortalPanel;
						this.facadeParts['Drawer'][regionSelector] = portletPanel;

						return portletPanel;
					},

					/**
					 * @method getBundleMenu
					 * 
					 * builds a default menu to support launching some bundles
					 * 
					 */
					getBundleMenu : function() {
						return [
						/*
						 * { text : 'Load Bundle Terminal', handler : function() {
						 * var fcd = Oskari.bundle_facade; fcd .require( {
						 * "Import-Bundle" : { "poc" : {}, "terminal" : {} } },
						 * function(manager) {
						 * 
						 * Oskari.bundle_facade .requireBundle( "terminal",
						 * "Term", function() { var yy = manager
						 * .createInstance("Term"); yy .start(); });
						 * 
						 * }); } },
						 */
						{
							text : 'Load Bundle: Bundle Manager',
							handler : function() {
								var fcd = Oskari.bundle_facade;
								fcd
										.require(
												{
													"Import-Bundle" : {
														"bundlemanager" : {
															bundlePath : "../example-bundles/bundle/"
														}
													}
												},
												function(manager) {

													Oskari.bundle_facade
															.requireBundle(
																	"bundlemanager",
																	"BundleManager",
																	function() {
																		var yy = manager
																				.createInstance("BundleManager");

																		yy
																				.start()

																	});

												});

							}
						} ];

					}

				});
