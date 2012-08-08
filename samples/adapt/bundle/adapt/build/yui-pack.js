/* This is a unpacked Oskari bundle (bundle script version Tue Feb 14 2012 08:27:46 GMT+0200 (Suomen normaaliaika)) */ 
Oskari.clazz
		.define(
				"Oskari.samples.adapt.BundleInstance",
				function() {
					this.map = null;
					this.mapster = null;
					this.ui = null;
					this.app = null;
				},
				{

					getApp: function() {
						return this.app;
					},
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
								.create('Oskari.samples.adapt.Application');
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
Oskari.clazz
		.define(
				'Oskari.samples.adapt.Application',
				function() {
					this._core = null;

					this.mapConfiguration = null;
					this.ui = null;
				},
				{
					
					getSandbox: function()  {
						return this._core.getSandbox();
					},

					/**
					 * @method setMapConfiguration
					 * 
					 */
					setMapConfiguration : function(mc) {
						this.mapConfiguration = mc;
					},

					/**
					 * @method getMapConfiguration
					 */
					getMapConfiguration : function() {
						return this.mapConfiguration;
					},

					/**
					 * kick start
					 */
					startFramework : function() {

						var conf = this.getMapConfiguration();

						var core = Oskari.clazz
								.create('Oskari.mapframework.core.Core');
						this._core = core;


						var services = this.createServices(conf);
						var enhancements = this.createEnhancements(conf);
						
						
						var ui = this.createUserInterface(conf);
						this.ui = ui;
						
						

						this.createDefaultExtensionModules(conf, ui);

						this.createExtensionBundles(conf, ui);

						this.createCoreQuirks(conf, core);

						core.init(ui, services, enhancements, conf.layers,
								conf.userInterfaceLanguage,
								conf.mapPublisherWizardUrl);

						

					},

					/**
					 * @method getUserInterface
					 */
					getUserInterface : function() {
						return this.ui;
					},

					/**
					 * some fiddling
					 */
					createCoreQuirks : function(conf, core) {
						/*
						 * If we want to turn development mode off, we will have
						 * to run that enhancement manually before initing core.
						 * Core runs enhancements after modules are initialized,
						 * so by attaching disablement to normal enhancements it
						 * is run too late. This is why we must run it here.
						 */
						if (conf.disableDevelopmentMode == 'true') {
							var disableDevelopmentModeEnhancement = Oskari.clazz
									.create(
											'Oskari.mapframework.enhancement.common.DisableDevelopmentModeEnhancement',
											true);
							disableDevelopmentModeEnhancement.enhance(core);
						}

					},

					/**
					 * setup services for this application
					 */
					createServices : function(conf) {

						/*
						 * create services that are available in this
						 * application
						 */
						var services = [];

						services.push(Oskari.clazz.create(
								'Oskari.mapframework.service.SearchService',
								conf.globalMapAjaxUrl,
								conf.globalPortletNameSpace));

						services.push(Oskari.clazz.create(
								'Oskari.mapframework.service.MapLayerService',
								conf.globalMapAjaxUrl));

						services
								.push(Oskari.clazz
										.create(
												'Oskari.mapframework.service.GetFeatureInfoService',
												conf.globalMapAjaxUrl));
						services.push(Oskari.clazz.create(
								'Oskari.mapframework.service.LanguageService',
								conf.userInterfaceLanguage));

						services
								.push(Oskari.clazz
										.create(
												'Oskari.mapframework.service.UsageSnifferService',
												2, "/log/"));

						return services;
					},

					/**
					 * setup enhancements for this application
					 */
					createEnhancements : function(conf) {

						/*
						 * create enhancements that will initialize, fix or
						 * modify some behaviour
						 */
						var enhancements = [];
						// enhancements.push(new
						// mapframework.enhancement.mapfull.ExtBlankImageEnhancement());

						/* Check which buttons are available */
						// var enableMapPublisher = (conf.mapPublisherWizardUrl
						// != null);
						var enableMapPublisher = false;
						var enableNetServiceCenter = (conf.netServiceCenterAvailable == true);

						enhancements
								.push(Oskari.clazz
										.create(
												'Oskari.mapframework.enhancement.mapfull.StartMapWithConfigurationsEnhancement',
												conf.preSelectedLayers,
												conf.mapConfigurations)); //

						enhancements
								.push(Oskari.clazz
										.create('Oskari.mapframework.enhancement.mapfull.StartMapWithLinkEnhancement'));

						return enhancements;
					},
					
					/**
					 * build ui for this application
					 */
					createUserInterface : function(conf) {

						/* Create ui manager */
						return Oskari.clazz
								.create(
										'Oskari.mapframework.ui.manager.adapt.AdaptUiManager',
										conf);

					},

					/**
					 * build extension modules for this application
					 */
					createDefaultExtensionModules : function(conf, uimanager) {
						/* Create any ui modules */
						/* All layers module */

						return uimanager;
					},

					/**
					 * This will load bundle manifests and launch any 1st party
					 * or 3rd party extension bundles to the application using
					 * bundle_manager (if IE>=9 native... anything goes) (if IE<=9
					 * quirks... only specifically crafted extension modules)
					 */
					createExtensionBundles : function(conf, uimanager) {
					}

				});
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
						plugins.push('Oskari.mapframework.mapmodule.LayersPlugin');
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

Oskari.clazz
		.define(
				'Oskari.mapframework.ui.manager.adapt.Facade',

				/**
				 * @constructor
				 * 
				 * creates a facade
				 */
				function(sandbox, manager, parts) {

					this.sandbox = sandbox;
					this.manager = manager;
					this.parts = parts;
					this.additionalComponents = {};
				},
				{
					/**
					 * @method registerPart
					 */
					registerPart : function(part, mod) {
						this.parts[part] = mod;
					},

					/**
					 * @method getSandbox
					 */
					getSandbox : function() {
						return this.sandbox;
					},

					/**
					 * @method getManager
					 */
					getManager : function() {
						return this.manager;
					},

					/**
					 * @method getParts
					 */
					getParts : function() {
						return this.parts;
					},

					/**
					 * @method appendExtensionModule
					 * 
					 * append and register bundle with optional UI component If
					 * UI component is not provided. Module init method should
					 * return UI component.
					 * 
					 * Wraps portlet kinds of panels with bundle close
					 * operations.
					 * 
					 * Registers events for extension bundle if requested
					 * 
					 */
					appendExtensionModule : function(module, identifier,
							eventHandlers, bundleInstance, regionDef, loc, comp) {

						var lang = this.sandbox.getLanguage();

						var def = this.manager.addExtensionModule(module,
								identifier, regionDef, loc, comp);

						def.bundleInstance = bundleInstance;
						if (def.module) {
							if (def.component)
								def.initialisedComponent = this.getSandbox()
										.register(def.module);
							else
								def.component = this.getSandbox().register(
										def.module);

						}

						if (def.component) {

							var region = null;

							var isPortlet = true;

							if (typeof regionDef == "string") {
								region = regionDef;
							}

							isPortlet = this.parts['Portlet'][region];

							if (isPortlet) {
								var portlet = {
									border: false,
									title : def.loc[lang].title,
									xtype : 'portlet',
									layout : 'fit',
									items : [ def.component ],
									tools : [ {
										type : 'gear',

										handler : function(event, toolEl, panel) {
											def.bundleInstance.config();
										}
									} ],
									listeners : {
										'close' : function() {
											def.bundleInstance.stop();
											var manager = def.bundleInstance.mediator.manager;
											var instanceid = def.bundleInstance.mediator.instanceid;
											manager.destroyInstance(instanceid);
											def.bundleInstance = null;

										}
									}

								};

								/*var partHost = this.parts['Drawer'][region];
								partHost.expand(false);*/

								var host = null;

								/**
								 * first column so need to getComponent(0)
								 */
								host = this.parts['Portlet'][region].getComponent(0);

								var cmp = host.add(portlet);
								def.host = host;
								def.cmp = cmp;

							} else {
								var host = this.parts[region];

								var cmp = host.add(def.component);
								def.host = host;
								def.cmp = cmp;

							}

							def.component = null;
						}

						/*
						 * register events
						 */
						for (p in eventHandlers) {
							this.sandbox.registerForEventByName(module, p);
						}

						return def;
					},
					
					/**
					 * @method addUIComponent
					 * 
					 * adds ui component to requested region
					 * 
					 */
					addUIComponent : function(identifier, component, region) {
						
						// TODO: should we call actual manager instead of manipulating panels here?
						this.parts[region].add(component);
						
						var compConf = {
							ident : identifier,
							region : region,
							comp: component
						};
						this.additionalComponents[identifier] = compConf;
					},

					/**
					 * @method removeUIComponent
					 * 
					 * removes an added ui component that matches given identifier
					 * TODO: experimental and lacking error handling
					 * 
					 */
					removeUIComponent : function(identifier) {
					
						var compConf = this.additionalComponents[identtifier];
						this.parts[compConf.region].remove(compConf.comp);
					},

					/**
					 * @method removeExtensionModule
					 * 
					 * remove and unregister module unregisters any events
					 */
					removeExtensionModule : function(module, identifier,
							eventHandlers, bundleInstance, def) {
						/*
						 * unregister events
						 */
						for (p in eventHandlers) {
							this.sandbox.unregisterFromEventByName(module, p);
						}

						this.sandbox.unregister(module);

					},

					/**
					 * @property collapseDirections
					 */
					collapseDirections : {
						'N' : Ext.Component.DIRECTION_TOP,
						'E' : Ext.Component.DIRECTION_RIGHT,
						'S' : Ext.Component.DIRECTION_BOTTOM,
						'W' : Ext.Component.DIRECTION_LEFT
					},

					/**
					 * @method collapsePart
					 */
					collapsePart : function(part) {
						this.parts['Drawer'][part].collapse(
								this.collapseDirections[part], false);
					},

					/**
					 * @method expandPart
					 */
					expandPart : function(part) {
						this.parts['Drawer'][part].expand(false);
					}

				}, {
					'protocol' : [ 'Oskari.mapframework.ui.manager.Facade' ]
				});

/**
 * This enchancement adds all preselected layers on map and moves to start
 * position
 * 
 */
Oskari.clazz
		.define(
				'Oskari.mapframework.enhancement.mapfull.StartMapWithConfigurationsEnhancement',
				function(preSelectedJson, mapConfigurations) {

					this._preSelectedJson = preSelectedJson;

					this._mapConfigurations = mapConfigurations;
				},
				{

					enhance : function(core) {
						var coord = core.getRequestParameter('coord');
						var zoomLevel = core.getRequestParameter('zoomLevel');
						var mapLayers = core.getRequestParameter('mapLayers');

						/*
						 * Check if map is started with link. In this case, we
						 * will honor map layers in request and forget
						 * preselected.
						 */
						if (coord != null && zoomLevel != null && mapLayers != null) {
							core.printDebug("Ahem, we found 'mapLayers, coord and zoomLevel' parameters from url. This is probably a link startup. Skipping preselection.");
							return;
						}

						/* ok, we can proceed */
						core.printDebug("Enhancing application by setting position.");
						
						var x = this._mapConfigurations.east;
						var y = this._mapConfigurations.north;
						var zoom = this._mapConfigurations.scale;
						var marker = false;

						core.getMap().moveTo(x, y, zoom);

						core.printDebug("Enhancing application by preselecting layers.");
						
						if(this._preSelectedJson.preSelectedLayers != undefined) {
							for ( var i = 0; i < this._preSelectedJson.preSelectedLayers.length; i++) {
								var item = this._preSelectedJson.preSelectedLayers[i];
								core.processRequest(
												core.getRequestBuilder('AddMapLayerRequest')(
												item.id, false));
							}
						}

					}
				},
				{
					'protocol' : ['Oskari.mapframework.enhancement.Enhancement']
				});

/* Inheritance */
/**
 * This enchancement adds all preselected layers on map
 *
 */
Oskari.clazz.define('Oskari.mapframework.enhancement.mapfull.StartMapWithLinkEnhancement', function() {
}, {
    enhance : function(core) {
        core.printDebug("Checking if map is started with link...");

        var coord = core.getRequestParameter('coord');
        var zoomLevel = core.getRequestParameter('zoomLevel');

        var mapLayers = core.getRequestParameter('mapLayers');
        var markerVisible = core.getRequestParameter('showMarker');
        var keepLayersOrder = core.getRequestParameter('keepLayersOrder');

        if(keepLayersOrder === null) {
            keepLayersOrder = true;
        } 

        core.getMap().setMarkerVisible(markerVisible == 'true');

        if(coord === null || zoomLevel === null) {
            // not a link
            return;
        }

        /* This seems like a link start */
        var splittedCoord;

        /*
         * Coordinates can be splitted either with new "_" or
         * old "%20"
         */
        if(coord.indexOf("_") >= 0) {
            splittedCoord = coord.split("_");
        } else {
            splittedCoord = coord.split("%20");
        }

        var longitude = splittedCoord[0];
        var latitude = splittedCoord[1];
        if(longitude === null || latitude === null) {
            core.printDebug("Could not parse link location. Skipping.");
            return;
        }
        core.getMap().moveTo(longitude, latitude, zoomLevel);
        //core.processRequest(core.getRequestBuilder('MapMoveRequest')(longitude,
        // latitude, 0, showMarker));

        core.printDebug("This is startup by link, moving map...");

        if(mapLayers !== null && mapLayers !== "") {
            core.printDebug("Continuing by adding layers...");
            var layerStrings = mapLayers.split(",");

            for(var i = 0; i < layerStrings.length; i++) {
                var splitted = layerStrings[i].split("+");
                var layerId = splitted[0];
                var opacity = splitted[1];
                var style = splitted[2];
                if((layerId.indexOf("_") != -1) && 
                   (layerId.indexOf("base_") == -1) && 
                   (layerId.indexOf("BASE_") == -1)) {
                    var subIds = layerId.split("_");
                    layerId = null;
                    var baseLayer = null;
                    for(var subId in subIds) {
                        if (subId) {
                            baseLayer = 
                                core.findBaselayerBySublayerIdFromAllAvailable(subIds[subId]);
                            if(baseLayer) {
                                layerId = baseLayer.getId();
                                break;
                            }
                        }
                    }
                }
                if(layerId !== null) {
                    var rb = null;
                    var r = null;
                    rb = core.getRequestBuilder('AddMapLayerRequest');
                    r = rb(layerId, keepLayersOrder);
                    core.processRequest(r);
                    rb = core.getRequestBuilder('ChangeMapLayerOpacityRequest');
                    r = rb(layerId, opacity);
                    core.processRequest(r);
                    rb = core.getRequestBuilder('ChangeMapLayerStyleRequest');
                    r = rb(layerId, style);
                    core.processRequest(r);
                } else {
                    core.printWarn("[StartMapWithLinkEnhancement] " + 
                                   "Could not find baselayer for " + 
                                   layerId);
                }
            }
        }
        //core.scheduleMapLayerRearrangeAfterWfsMapTilesAreReady();
    }
}, {
    'protocol' : ['Oskari.mapframework.enhancement.Enhancement']
});

/* Inheritance */
