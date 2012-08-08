/* This is a unpacked Oskari bundle (bundle script version Mon Feb 27 2012 09:28:33 GMT+0200 (Suomen normaaliaika)) */ 
Oskari.clazz
		.define(
				'Oskari.mapframework.candy2.Sample',
				function() {
					this._core = null;

					this.mapConfiguration = null;
					this.ui = null;
				},
				{

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

					getSandbox : function() {
						return this._core.getSandbox();
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

						/*
						 * Openlayers image position must be set before core is
						 * initialized
						 */
				
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
						/*
						 * enhancements.push( Oskari.clazz.create(
						 * 'Oskari.mapframework.enhancement.common.EnableOpenLayersZoombarTitlesEnhancement', //
						 * "#_OpenLayers_ViewPort" // "#panzoombar"
						 * "#OpenLayers_Control_PanZoomBar_ZoombarOpenLayers.Map_3"
						 * ));
						 */
						/*
						 * enhancements
						 * .push(Oskari.clazz.create('Oskari.mapframework.enhancement.mapfull.KeyListenerEnhancement'));
						 */

						

						return enhancements;
					},

					/**
					 * build ui for this application
					 */
					createUserInterface : function(conf) {

						/* Create ui manager */
						return Oskari.clazz
								.create(
										'Oskari.mapframework.oskari.ui.Candy2FullUiManager',
										conf);

					},

					/**
					 * build extension modules for this application
					 */
					createDefaultExtensionModules : function(conf, uimanager) {
						/* Create any ui modules */
						/* All layers module */

						var allLayersModule = Oskari.clazz
								.create('Oskari.mapframework.ui.module.layerselector.AllLayersModule'); //
						uimanager.addExtensionModule(allLayersModule,
								'allLayersModule', 'NW');

						var selectedLayersModule = Oskari.clazz
								.create('Oskari.mapframework.ui.module.layerselector.SelectedLayersModule');
						uimanager.addExtensionModule(selectedLayersModule,
								'selectedLayersModule', 'W');

						var searchModule = Oskari.clazz
								.create('Oskari.mapframework.ui.module.searchservice.SearchModule');
						uimanager.addExtensionModule(searchModule,
								'searchModule', 'E');

						var metadataModule = Oskari.clazz
								.create('Oskari.mapframework.ui.module.searchservice.MetadataModule');
						uimanager.addExtensionModule(metadataModule,
								'metadataModule', 'E');

						if (conf.bundles) {
							for (bundleIndex in conf.bundles) {
								var bundle = conf.bundles[bundleIndex];
								uimanager.addExtensionModule(Oskari.clazz
										.create(bundle.type, bundle.config),
										bundle.ident, bundle.location);
							}
						}

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

Oskari.clazz
		.define(
				'Oskari.mapframework.oskari.ui.Candy2Facade',

				/**
				 * @constructor
				 * 
				 * creates a facade
				 */
				function(sandbox, manager, parts) {

					this.sandbox = sandbox;
					this.manager = manager;
					this.parts = parts;

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

							var host = this.parts[region];

							var ttl = null;
							if( loc && loc[lang] )
								ttl = loc[lang].title;
							
							var subcmp = {
									title: ttl,
									layout: 'fit',
									items: [def.component]
							};
							
							var cmp = host.add(subcmp);
							def.host = host;
							def.cmp = cmp;

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
						if( this.parts['Drawer'][part]) {
							this.parts['Drawer'][part].collapse(
								this.collapseDirections[part], false);
						} else {
							this.parts[part].collapse(true);
						}
					},

					/**
					 * @method expandPart
					 */
					expandPart : function(part) {
						if( this.parts['Drawer'][part]) {
							this.parts['Drawer'][part].expand(false);
						} else {
							this.parts[part].expand(true);
						}
					}

				}, {
					'protocol' : [ 'Oskari.mapframework.ui.manager.Facade' ]
				});

/**
 * 
 */
Oskari.clazz
		.define(
				'Oskari.mapframework.oskari.ui.Candy2FullUiManager',
				function(conf) {

					/** Sandbox */
					this._sandbox;

					/** configuration for this ui manager * */
					this._conf = conf;

					/** Top level dom element that contains map */
					this._mapModuleDom;

					/**
					 * Top level dom element that represents map position i.e.
					 * footer
					 */
					this._mapPositionModuleDom;

					/** Top level ext component that represents overlay popup */
					this._overlayPopupModuleExt;

					/** Map controls dom */
					this._mapControlsDom;

					/** ui modules * */
					/*
					 * { region: 'west', module: mod, identifier : 'xxx }
					 */
					this._uimodules = []; // array to preserve order when
					// needed
					this._uimodulesByName = {};
				},
				{
					/**
					 * Creates actual modules and ui
					 * 
					 * @param {Object}
					 *            sandbox
					 */
					createModulesAndUi : function(sandbox) {
						sandbox.printDebug("[MapFullUiManager] "
								+ "Creating UI for Map full...");
						this._sandbox = sandbox;

						var conf = this._conf;

						/* setup core ui modules */

						/* Map module */
						var showIndexMap = conf.mapConfigurations.index_map;
						var showZoomBar = conf.mapConfigurations.zoom_bar;
						var showScaleBar = conf.mapConfigurations.scala_bar;
						var allowMapMovements = conf.mapConfigurations.pan;
						var module = Oskari.clazz
								.create(
										'Oskari.mapframework.ui.module.common.MapModule',
										"Main", showIndexMap, showZoomBar,
										showScaleBar, allowMapMovements);
						this._mapModuleDom = sandbox.register(module);
						
						/**
						 * plugins
						 */
						var plugins = [];
						plugins.push('Oskari.mapframework.mapmodule.LayersPlugin');
						plugins.push('Oskari.mapframework.mapmodule.WmsLayerPlugin');
				        plugins.push('Oskari.mapframework.mapmodule.ControlsPlugin');
						
				        for(var i = 0; i < plugins.length; i++) {
				            var plugin = Oskari.clazz.create(plugins[i]);
				            module.registerPlugin(plugin);
				        } 

						sandbox.printDebug("[MapFullUiManager] "
								+ "creating default ui modules...");
						/* Map controls module */
						var showMapControls = conf.mapConfigurations.map_function;
						if (showMapControls) {
							var module = Oskari.clazz
									.create('Oskari.mapframework.ui.module.common.MapControlsModule');
							this._mapControlsDom = sandbox.register(module);
						} else {
							this._mapControlsDom = "";
						}

						/* Map position module */

						var showMapPosition = false;// conf.mapConfigurations.footer;
						if (showMapPosition) {
							var module = Oskari.clazz
									.create('Oskari.mapframework.ui.module.mapfull.MapPositionModule');
							this._mapPositionModuleDom = sandbox
									.register(module);
						} else {
							this._mapPositionModuleDom = null;
						}

						/* OverLay popup module */
						/*
						 * var module = Oskari.clazz
						 * .create('Oskari.mapframework.ui.module.common.OverlayPopupModule');
						 * this._overlayPopupModuleExt =
						 * sandbox.register(module);
						 */

						/* extension modules */
						this.setupExtensionModules(sandbox);

						/*
						 * Modules created, next build up EXTjs Frame and fit
						 * modules to that. Yes, it is that simple.
						 */
						sandbox
								.printDebug("[MapFullUiManager] "
										+ "All modules created, next build up EXTJs frame...");
						this.createUi(sandbox);
						sandbox.printDebug("[MapFullUiManager] "
								+ "Map full UI construction completed.");

					},

					/**
					 * Let's register module to sandbox (internal)
					 */
					setupExtensionModules : function(sandbox) {
						sandbox.printDebug("[MapFullUiManager] "
								+ "setupExtensionModules...");

						for ( var n = 0; n < this._uimodules.length; n++) {
							var def = this._uimodules[n];
							sandbox.printDebug("[MapFullUiManager] "
									+ "Registering " + def.identifier);

							def.component = sandbox.register(def.module);

						}
					},

					/**
					 * interface to add extension module to ui
					 */
					addExtensionModule : function(module, identifier, region) {
						var def = {
							module : module,
							identifier : identifier,
							region : region,
							component : null
						// setup in setupExtensionModules see above
						};
						this._uimodules.push(def);
						this._uimodulesByName[identifier] = def;

						return def;
					},

					/**
					 * Returns extension ui module by name
					 */
					getExtensionModule : function(identifier) {
						return this._uimodulesByName[identifier].module;
					},
					getExtensionModuleDefinition : function(identifier) {
						return this._uimodulesByName[identifier];
					},

					/*
					 * Returns extension ui modules by region def { 'NW' : true,
					 * 'N': true ... }
					 */
					getExtensionModuleComponentsByRegion : function(
							regionSelector) {
						var sandbox = this._sandbox;
						var results = [];
						var dbgStr = "";
						for (p in regionSelector) {
							dbgStr += p + "=" + regionSelector[p] + " ";
						}
						sandbox.printDebug("[MapFullUiManager] "
								+ "getExtensionModulesByRegion called with "
								+ dbgStr);
						for ( var n = 0; n < this._uimodules.length; n++) {
							var def = this._uimodules[n];
							if (regionSelector[def.region]) {
								results.push(def.component);
								sandbox.printDebug("[MapFullUiManager] "
										+ "- module " + def.identifier
										+ " matched");
							}
						}

						return results;
					},
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

					createMapContainer : function(map) {
						var mapster = Ext.createWidget('nlsfimappanel', {
							olmap : map,
							layout : 'absolute',
							bodyBorder : false,
							flex : 1,
							bodyCls : 'mapster'
						});

						return mapster;
					},

					/**
					 * Constructs EXTJs Frame and inserts modules into that.
					 */
					createUi : function(sandbox) {
						var mapConfigurations = Oskari.$().startup.mapConfigurations;

						var gridModuleHeight = 300;

						/**
						 * UI WEST
						 */
						var nwItems = this
								.getExtensionModuleComponentsByRegion( {
									'NW' : true
								});

						var allMenuPanels = [];

						if (nwItems.length > 0)
							allMenuPanels.push(Ext.create('Ext.Panel', {
								anchor : '100%, 50%',
								id : 'left_upper',
								border : false,
								frame : false,
								layout : 'fit',
								items : nwItems
							}));

						var westItems = this
								.getExtensionModuleComponentsByRegion( {
									'W' : true
								});
						for ( var n = 0; n < westItems.length; n++)
							allMenuPanels.push(westItems[n]);

						var pnl = null;

						if (this._mapModuleDom) {

							pnl = Ext.create('Ext.Panel', {
								region : 'center',
								layout : 'fit',
								flex : 1,
								bodyBorder : false,
								items : []
							});

						}

						var searchModule = this._uimodulesByName['searchModule'];
						if (searchModule)
							allMenuPanels.push(searchModule.component);

						/*
						 * Create Toolbar
						 */
						var tpl = '<em id="{id}-btnWrap" class="menubutton">'
								+ '<button class="menubutton" id="{id}-btnEl" type="{type}" hidefocus="true"'
								+
								// the autocomplete="off" is required to prevent
								// Firefox from remembering
								// the button's disabled state between page
								// reloads.
								'<tpl if="tabIndex"> tabIndex="{tabIndex}"</tpl> role="button" autocomplete="off">'
								+ '<span id="{id}-btnInnerEl" class="{baseCls}-inner" style="{innerSpanStyle}">'
								+ '{text}'
								+ '</span>'
								+ '<span id="{id}-btnIconEl" class="{baseCls}-icon {iconCls}">&#160;</span>'
								+ '</button>' + '</em>';

						var mediator = {
							toolsMenuRight : null,
							toolsMenu : null,
							toolsMenuShown : false,
							toolsMenuLeft : null
						};
						var toolsMenuLeft = Ext.create('Ext.panel.Panel', {
							flex : 0,
							width : 256,
							height : 412,
							frame : false,
							bodyCls : 'toolsmenu_left',
							layout : {
								type : 'vbox',
								align : 'stretch'
							},
							items : [
									{
										xtype : 'button',
										text : 'Hae paikkoja tai osoitteita',
										flex : 0,
										height : 32,
										renderTpl : tpl,
										baseCls : 'menubutton',
										handler : function() {
											mediator.toolsMenuRight.getLayout()
													.setActiveItem(2);
										}
									},
									{
										xtype : 'button',
										text : 'Karttatasot',
										flex : 0,
										height : 32,
										renderTpl : tpl,
										baseCls : 'menubutton',
										handler : function() {
											mediator.toolsMenuRight.getLayout()
													.setActiveItem(0);
										}

									},
									{
										xtype : 'button',
										text : 'Valitut karttatasot',
										flex : 0,
										height : 32,
										renderTpl : tpl,
										baseCls : 'menubutton',
										handler : function() {
											mediator.toolsMenuRight.getLayout()
													.setActiveItem(1);
										}

									} ]

						});
						mediator.toolsMenuLeft = toolsMenuLeft;

						var toolsMenuRight = Ext.create('Ext.panel.Panel', {
							layout : {
								type : 'card'
							},
							itemCls : 'toolsmenuitem',
							activeItem : 2,
							flex : 1,
							height : 412,
							items : allMenuPanels,
							bodyFrame : false,
							bodyCls : 'toolsmenu_right'
						});
						mediator.toolsMenuRight = toolsMenuRight;

						var toolsMenu = Ext.create('Ext.panel.Panel', {
							layout : {
								type : 'hbox',
								align : 'top'
							},
							hideMode : 'offsets',
							floating : true,
							shadow : 'sides',
							/* modal: true, */
							frame : false,
							autoShow : false,
							preventHeader : true,
							width : 768,
							height : 512,
							x : 32,
							y : 96,
							closable : false,
							resizable : false,
							bodyBorder : false,
							border : 0,
							html : '<span class="menutitle">Toiminnot</span>',
							items : [ toolsMenuLeft, toolsMenuRight ],
							bodyCls : 'toolsmenu'
						});
						mediator.toolsMenu = toolsMenu;

						/**
						 * Create viewport, where is used border layout.
						 */

						var mainItems = [];

						var me = this;

						var toolstpl = '<em id="{id}-btnWrap" class="toolsbar">'
								+ '<button class="toolsbar" id="{id}-btnEl" type="{type}" hidefocus="true"'
								+ '<tpl if="tabIndex"> tabIndex="{tabIndex}"</tpl> role="button" autocomplete="off">'
								+ '<span id="{id}-btnInnerEl" class="{baseCls}-inner" style="{innerSpanStyle}">'
								+ '{text}'
								+ '</span>'
								+ '<span id="{id}-btnIconEl" class="{baseCls}-icon {iconCls}">&#160;</span>'
								+ '</button>' + '</em>';

						mainItems.push( {
							xtype : 'button',
							width : 48,
							flex : 0,
							baseCls : 'toolsbar',
							iconCls : 'toolsbarIcon',
							renderTpl : toolstpl,
							handler : function() {
								if (!mediator.toolsMenuShown) {
									toolsMenu.show();
									mediator.toolsMenuShown = true;
								} else {
									toolsMenu.hide();
									mediator.toolsMenuShown = false;
								}
							}
						});
						mainItems.push(pnl);

						var viewport = Ext.create('Ext.Panel', {
							layout : {
								type : 'hbox',
								align : 'stretch'
							},
							id : 'main-app',
							bodyCls : 'main-app',
							bodyBorder : false,
							items : mainItems
						});

						var container = Ext.create('Ext.container.Viewport', {
							layout : 'fit',
							items : [ viewport ]
						});

						var mapster = this
								.createMapContainer(this._mapModuleDom);
						pnl.add(mapster);

						if (this._mapControlsDom)
							mapster.add(this._mapControlsDom);

						/**
						 * Publish UI parts as Facade
						 */
						this._facade = Oskari.clazz.create(
								'Oskari.mapframework.oskari.ui.Candy2Facade',
								sandbox, this, {
									/*
									 * 'Drawer': { 'W' : westPanel, 'E' :
									 * eastPanel }, 'W' : westPanel, 'E' :
									 * eastPanel,
									 */
									'Viewport' : viewport,
									'ToolMenu' : toolsMenu

								});

						/**
						 * TEMP hack
						 */
						Oskari.$("UI.facade", this._facade);

						this._uiReady = true;
					},

					getFacade : function() {
						return this._facade;
					}

				});
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
								.create('Oskari.mapframework.candy2.Sample');

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
						this.app = app;

					},
					
					getApp: function() {
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
