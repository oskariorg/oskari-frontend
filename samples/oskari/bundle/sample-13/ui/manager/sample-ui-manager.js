/**
 * 
 */
Oskari.clazz
		.define(
				'Oskari.mapframework.oskari.ui.SampleFullUiManager',
				function(conf) {

					/** Sandbox */
					this._sandbox;

					/** configuration for this ui manager * */
					this._conf = conf;

					/** Top level ext component that represents all layers */
					// this._allLayersModuleExt;
					/** Top level ext component that represents selected layers */
					// this._selectedLayersModuleExt;
					/** Top level dom element that contains map */
					this._mapModuleDom;

					/** Top level ext component that represents search panel */
					this._searchModuleExt;

					/** Top level ext component that represents grid panel */
					/**
					 * Top level ext component that represents net service
					 * centre window
					 */
					// this._netServiceCentreModuleExt;
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
						sandbox.printDebug("[MapFullUiManager] " + 
						                   "Creating UI for Map full...");
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
						plugins.push('Oskari.mapframework.bundle.mapmodule.plugin.LayersPlugin');
						plugins.push('Oskari.mapframework.mapmodule.WmsLayerPlugin');
				        plugins.push('Oskari.mapframework.mapmodule.ControlsPlugin');
						
				        for(var i = 0; i < plugins.length; i++) {
				            var plugin = Oskari.clazz.create(plugins[i]);
				            module.registerPlugin(plugin);
				        } 

						sandbox.printDebug("[MapFullUiManager] " +
						                   "creating default ui modules...");
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

						var showMapPosition = false;//conf.mapConfigurations.footer;
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
						var module = Oskari.clazz
								.create('Oskari.mapframework.ui.module.common.OverlayPopupModule');
						this._overlayPopupModuleExt = sandbox.register(module);
*/

						/* extension modules */
						this.setupExtensionModules(sandbox);				
						
						/*
						 * Modules created, next build up EXTjs Frame and fit
						 * modules to that. Yes, it is that simple.
						 */
						sandbox.printDebug("[MapFullUiManager] " +
								           "All modules created, next build up EXTJs frame...");
						this.createUi(sandbox);
						sandbox.printDebug("[MapFullUiManager] " +
						                   "Map full UI construction completed.");


					},

					/**
					 * Let's register module to sandbox (internal)
					 */
					setupExtensionModules : function(sandbox) {
						sandbox.printDebug("[MapFullUiManager] " +
						                   "setupExtensionModules...");

						for ( var n = 0; n < this._uimodules.length; n++) {
							var def = this._uimodules[n];
							sandbox.printDebug("[MapFullUiManager] " +
							                   "Registering " +
							                   def.identifier);

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
						sandbox.printDebug("[MapFullUiManager] " +
						                   "getExtensionModulesByRegion called with "
										   + dbgStr);
						for ( var n = 0; n < this._uimodules.length; n++) {
							var def = this._uimodules[n];
							if (regionSelector[def.region]) {
								results.push(def.component);
								sandbox.printDebug("[MapFullUiManager] " +
								                   "- module " + 
								                   def.identifier +
										           " matched");
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
					
					/**
					 * creates (Ext) map panel
					 */
					createMapPanel: function() {

						var pnl = Ext.create('Ext.Panel', {
							region : 'center',
							layout : 'fit',
							items : []
						});
						
						return pnl;
						
					},
					
					createMapContainer: function(map) {
						var mapster = Ext.createWidget('nlsfimappanel', {
							olmap : map,
							layout:'absolute',
							flex: 1
						});

						return mapster;
					},

					/***********************************************************
					 * @to-do (re)move
					 * 
					 * Create Service wizard module
					 * 
					 * @param {Object}
					 *            sandbox
					 */
					/*
					 * createServiceWizard : function(sandbox) { var
					 * serviceWizardOpt = new
					 * mapframework.domain.WizardOptions(); var cType = new
					 * mapframework.domain.WizardStep();
					 * 
					 * var mainUrl = Oskari.$().startup.secureViewUrl + "&URL=";
					 * var step1url = mainUrl + "service-wizard-step1"; var
					 * step2url = mainUrl + "service-wizard-step2"; var step3url =
					 * mainUrl + "service-wizard-step3"; var step4url = mainUrl +
					 * "service-wizard-step4"; var step5url = mainUrl +
					 * "service-wizard-step5";
					 * 
					 * var step1ActionKeys = new Array(); var step2ActionKeys =
					 * new Array(
					 * "NSC_WFS_SERVICE_WIZARD_FIND_SERVICES_FROM_GEONETWORK");
					 * var step3ActionKeys = new Array(
					 * "NSC_WFS_SERVICE_WIZARD_TEST_BASIC_AUTHENTICATION_USERNAME_AND_PASSWORD");
					 * var step4ActionKeys = new Array(
					 * "NSC_WFS_SERVICE_WIZARD_LIST_FEATURE_TYPES"); var
					 * step5ActionKeys = new Array();
					 * 
					 * var arrayOfSteps = new Array(
					 * Oskari.clazz.create('Oskari.mapframework.domain.WizardStep',"",
					 * "1. Valitse palvelun tyyppi, jonka haluat luoda",
					 * step1url, cType.CONTENT_TYPE_DYNAMIC_PANEL,
					 * step1ActionKeys), new mapframework.domain.WizardStep("",
					 * "2. Valitse yksi WFS palvelu", step2url,
					 * cType.CONTENT_TYPE_DYNAMIC_PANEL, step2ActionKeys), new
					 * mapframework.domain.WizardStep("", "3. Jos palvelu vaatii
					 * tunnukset, syötä ne", step3url,
					 * cType.CONTENT_TYPE_DYNAMIC_PANEL, step3ActionKeys),
					 * Oskari.clazz.create('Oskari.mapframework.domain.WizardStep,
					 * "", "4. Valitse muunnokset palvelun kohdetyyppien
					 * ominaisuustiedoille", step4url,
					 * cType.CONTENT_TYPE_DYNAMIC_PANEL, step4ActionKeys), new
					 * mapframework.domain.WizardStep( "", "5. Palvelun
					 * määrittely on valmis", step5url,
					 * cType.CONTENT_TYPE_DYNAMIC_PANEL, step5ActionKeys));
					 * serviceWizardOpt.setWizardSteps(arrayOfSteps);
					 * serviceWizardOpt.setWizardName("Palvelun määrittely");
					 * serviceWizardOpt.setWizardId("Service"); var module = new
					 * mapframework.ui.module.common.WizardModule(
					 * serviceWizardOpt); var wizard = sandbox.register(module);
					 * 
					 * return wizard; },
					 */

					/**
					 * Constructs EXTJs Frame and inserts modules into that.
					 */
					createUi : function(sandbox) {
						var mapConfigurations = Oskari.$().startup.mapConfigurations;

						var gridModuleHeight = 300;

						/** UI SOUTH * */

						var southItems = this
								.getExtensionModuleComponentsByRegion( {
									'S' : true
								});

						var southPanel = Ext.create('Ext.Panel', {
							region : 'south',
							split : true,
							layout : 'fit',
							region : 'south',
							collapsed : true,
							collapsible : true,
							animCollapse : false,
							titleCollapse : false,
							collapseMode : 'mini',
							id : 'main-app-bottom',
							height : gridModuleHeight,
							boxMinHeight : gridModuleHeight,
							width : mapConfigurations.width,
							animCollapse : false,
							titleCollapse : false,
							frame : true,
							header : false,
							items : southItems
						});

						/**
						 * UI EAST
						 */
						var eastItems = this
								.getExtensionModuleComponentsByRegion( {
									'E' : true
								});
						var eastPanel = Ext.create('Ext.Panel', {
						    id : 'main-right-panel',
							region : 'east',
							collapsible : true,
                            collapseMode : 'mini',
							split : true,
							layout : 'accordion',
						    layoutConfig: {
						        // layout-specific configs go here
						        titleCollapse: false,
						        animate: true,
						        activeOnTop: true
						    },
                            width : 220, 
							items : eastItems,
							collapsed : eastItems.length == 0
						});
						/**
						 * UI WEST
						 */
						var nwItems = this
								.getExtensionModuleComponentsByRegion( {
									'NW' : true
								});

						var allWestItems = [];

						if (nwItems.length > 0)
							allWestItems.push(Ext.create('Ext.Panel', {
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
							allWestItems.push(westItems[n]);

						var westPanel = Ext.create('Ext.Panel', {
							region : 'west',
							split : true,
							layout : 'anchor',
							items : allWestItems,
							id : 'main-left-panel',
							collapseMode : 'mini',
							collapsed : allWestItems.length == 0,
							border : false,
							frame : false,
							width : 220,
							region : 'west',
							collapsible : true,
							split : true,
							animCollapse : false,
							titleCollapse : false,
							autoHeight : false,
							boxMaxWidth : 600,
							boxMinWidth : 220,
							hidden : !mapConfigurations.plane_list,
							title : sandbox
									.getText("leftpanel_maplevels_title")
						});

						/**
						 * UI MAIN (center)
						 */

//						var centerItems = [];
						var pnl = null;
						
						if (this._mapModuleDom) {
					
							pnl = this.createMapPanel();
						

						}
						// If map not added -> show "No items"
						if(!pnl) {
						    pnl = Ext.create('Ext.Panel', {
						        html : '<b>No items</b>',
						        layout : 'fit'
                            });
						}

						var centerPanel = Ext.create('Ext.Panel', {
							region : 'center',
							split : true,
							items : [pnl],
							id : 'main-center',
							border : false,
							region : 'center',
							layout : 'fit',
							frame : false,
							header : false,
							collapsible : false,
							animCollapse : false,
							titleCollapse : false
						});

						/**
						 * Create viewport, where is used border layout.
						 */

						var mainItems = [];
						if (westPanel)
							mainItems.push(westPanel);

						mainItems.push(centerPanel);

						if (eastPanel)
							mainItems.push(eastPanel);

						var bottomTools = [];

						if (this._mapPositionModuleDom)
							bottomTools.push(this._mapPositionModuleDom);
						
						var statusDocked = Ext.create('Ext.toolbar.Toolbar', {
							dock : 'bottom',
							items : bottomTools
						});


						var viewportCenterPanel =  Ext.create('Ext.Panel', {
						    id : 'main-app-panel',
							layout : 'border',
							region : 'center',
							items : mainItems,
							bbar : statusDocked//bottomTools
						});
						
						var viewport = Ext.create('Ext.Panel', {
                            layout : 'border',
							id : 'main-app',
							renderTo : 'map-full',
							width : mapConfigurations.width, 
							height : mapConfigurations.height
									+ gridModuleHeight, 
							split : true,
							items : [ viewportCenterPanel, southPanel ]/*,
							tbar : [ {
								xtype : 'splitbutton',
								text : 'Bundle',
								scale : 'large',
								minWidth : 64,
								iconAlign : 'top',
								arrowAlign : 'bottom',
								menu : [ this.getBundleMenu() ]
							} ]*/
						});
						

						//viewport.show();
						
						/*
						var container = Ext.create('Ext.container.Viewport', {
							layout : 'fit',
							//autoShow: false,
							items : [ viewport ]
						});
						
						*/
						
						var mapster = this.createMapContainer(this._mapModuleDom);
						pnl.add(mapster);
						
						if( this._mapControlsDom )
							mapster.add(this._mapControlsDom);

						
						//container.show();
						
						/**
						 * Publish UI parts as Facade
						 */
						this._facade = Oskari.clazz
								.create(
										'Oskari.mapframework.oskari.ui.SampleFacade',
										sandbox,
										this,
										{
											'W' : westPanel,
											'E' : eastPanel,
											'S' : southPanel,
											'Center' : centerPanel,
											'Viewport' : viewport,
											'ViewportCenter' : viewportCenterPanel,
											'StatusRegion' : statusDocked
										/*
										 * , 'ToolbarRegion': toolbarDocked
										 */
										});

						/**
						 * TEMP hack
						 */
						Oskari.$("UI.facade", this._facade);



						this._uiReady = true;
					},
					/**
					 * @method getBundleMenu
					 * 
					 * builds a default menu to support launching some bundles
					 * 
					 */
					getBundleMenu : function() {
						return [
								/*{
									text : 'Load Bundle Terminal',
									handler : function() {
										var fcd = Oskari.bundle_facade;
										fcd
												.require(
														{
															"Import-Bundle" : {
																"poc" : {},
																"terminal" : {}
															}
														},
														function(manager) {

															Oskari.bundle_facade
																	.requireBundle(
																			"terminal",
																			"Term",
																			function() {
																				var yy = manager
																						.createInstance("Term");
																				yy
																						.start();
																			});

														});

									}
								},*/
								{
									text : 'Load Bundle: Bundle Manager',
									handler : function() {
										var fcd = Oskari.bundle_facade;
										fcd
												.require(
														{
															"Import-Bundle" : {
																"bundlemanager" : {
																	bundlePath: "../example-bundles/bundle/"
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

