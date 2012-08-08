/**
 * 
 */
Oskari.clazz
		.define(
				'Oskari.mapframework.oskari.ui.WebFormUiManager',
				function(conf, app) {

					this._app = app;

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

						var me = this;
						sandbox.register(me);

						for (p in me.eventHandlers) {
							console.log("WEBFORM REGISTER TO ", p);
							sandbox.registerForEventByName(me, p);
						}

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
						//plugins.push('Oskari.mapframework.mapmodule.SketchLayerPlugin');
				        plugins.push('Oskari.mapframework.mapmodule.MarkersPlugin');
				        plugins.push('Oskari.mapframework.mapmodule.VectorLayerPlugin');
				        plugins.push('Oskari.mapframework.mapmodule.TilesGridPlugin');
				        plugins.push('Oskari.mapframework.mapmodule.ControlsPlugin');
				        plugins.push('Oskari.mapframework.mapmodule.WfsLayerPlugin');
				        plugins.push('Oskari.mapframework.mapmodule.GetInfoPlugin');
						
				        for(var i = 0; i < plugins.length; i++) {
				            var plugin = Oskari.clazz.create(plugins[i]);
				            module.registerPlugin(plugin);
				        } 
						
						

						sandbox.printDebug("[MapFullUiManager] "
								+ "creating default ui modules...");
						/* Map controls module */
						var showMapControls = false;// conf.mapConfigurations.map_function;
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

					defaults : {
						minScale : 40000,
						maxScale : 1

					},

					/**
					 * Temp HACK for demo purposes to adapt some 2009 code
					 * 
					 */
					adaptWebForm : function() {
						var sandbox = this._sandbox;
						/**
						 * a lot of hacks to embed 2009 app to framework
						 */

						var xt = Ext;

						var bundleInstance = this;

						var webFormApp = Oskari.clazz.create(
								'Oskari.poc.sade3.SadeApp', {});
						this._app.webFormApp = webFormApp;

						webFormApp.setSandbox(sandbox);

						var mediator = Oskari.clazz
								.create('Oskari.poc.sade3.Mediator');
						webFormApp.setMediator(mediator);

						var worker = Oskari.clazz
								.create(
										'Oskari.poc.sade3.SadeWorker',
										{
											urls : {

												KTJkiiWFS : "../../../wfs-dispatch/ktjkii-wfs/wfs",
												RakennustiedotWFS : "../../../wfs-dispatch/rahu/wfs",
												NimistoWFS : "../../../wfs-dispatch/nimisto/wfs",
												MaastoWFS : "../../../wfs-dispatch/maasto/wfs"

											/*
											 * KTJkiiWFS:
											 * "http://kiti01.nls.fi/wfs-dispatch/ktjkii-wfs/wfs",
											 * 
											 * RakennustiedotWFS:
											 * "http://kiti01.nls.fi/wfs-dispatch/rahu/wfs",
											 * 
											 * NimistoWFS:
											 * "http://kiti01.nls.fi/wfs-dispatch/nimisto/wfs",
											 * 
											 * MaastoWFS:
											 * "http://kiti01.nls.fi/wfs-dispatch/maasto/wfs"
											 * 
											 */

											}
										});

						var me = this;

						var lm = Oskari.clazz.create(
								'Oskari.poc.sade3.LayerManager', sandbox,
								worker.workerLayers, this.defaults, true, me
										.getName());
						this.layerManager = lm;

						webFormApp.setLayerManager(lm);
						lm.createLayer("sade", true, null);

						worker.mapplet.setLayerManager(lm);
						worker.mapplet.mapProj = new OpenLayers.Projection(
								"EPSG:3067");

						worker.setupWorkers();

						webFormApp.setWorker(worker);

						var ui = Oskari.clazz.create('Oskari.poc.sade3.SadeUI');
						this._app.webFormUI = ui;

						ui.setMapAdapter(lm);

						ui.setApp(webFormApp);

						ui.getFormView().createFields(ui);
						ui.getFormView().grids['RakennuksenOminaisuustiedot'] = ui
								.getFormView().createGrid(ui);

						var adapter = Oskari.clazz.create(
								'Oskari.poc.sade3.Adapter', webFormApp, ui);
						webFormApp.setAdapter(adapter);

						/* ui.showUserInterface(); */

						// this.worker = worker;
						// worker.start();
						return ui;
					},

					"start" : function() {
					},
					"stop" : function() {
					},
					"init" : function() {
					},

					eventHandlers : {

						"MyPlaces.MyPlaceSelectedEvent" : function(event) {

							/**
							 * HACK to update OpenLayers dims
							 */
							
							  console.log("HACK","update OpenLayers SIZE"); var
							  mapmodule =
							 this._sandbox.findRegisteredModuleInstance('MainMapModule');
							  mapmodule._map.updateSize();
							 
							/**
							 * a HACK used to cancel highlight
							 * 
							 */

							this._app.webFormApp.getLayerManager()
									.dimMapLayer();
						},

						"AfterMapMoveEvent" : function(event) {
							var me = this;
							var sandbox = this.sandbox;

							var scale = event.getScale();

							if (!(scale < this.defaults.minScale && scale > this.defaults.maxScale))
								return;

							var n = event.getCenterY();
							var e = event.getCenterX();

							// TBD

						},
						"FeaturesGetInfoEvent" : function(event) {
							var xt = Ext;
							var x0 = event.getLon();
							var y0 = event.getLat();
							var layer = event.getMapLayer();
							var sandbox = this._app.webFormApp
									.getLayerManager().sandbox;

							// hack
							if (layer.getId() != this._app.webFormApp
									.getLayerManager().layers["sade"].layerId) {
								return;
							}
							var me = this;
							var ui = this._app.webFormUI;

							ui.reset(); // form

							this._app.webFormApp.getWorker().reset(); // layers

							var lonlat = new OpenLayers.LonLat(x0, y0);

							this._app.webFormApp.getWorker().searchAnyByLonLat(
									lonlat);

							// TBD

						},
						"AfterAddExternalMapLayerEvent" : function(event) {
							var layer = event.getLayer();
							console.log("AfterAddExternalMapLayerEvent", event,
									layer, this._app.webFormApp);

							this._app.webFormApp.getLayerManager()
									.registerLayerImpl(layer);
						},
						"AfterRemoveExternalMapLayerEvent" : function(event) {

						}
					},
					onEvent : function(event) {
						console.log("EVENT", event);
						return this.eventHandlers[event.getName()].apply(this,
								[ event ]);
					},

					getName : function() {
						return "WebForm";
					},

					/**
					 * 
					 * @method createWebFormContainer
					 * 
					 * Creates a Sample Tabbed Form 
					 */
					createWebFormContainer : function(parts, map, mapControls,
							featuresPanel) {

						var mapster = Ext.createWidget('nlsfimappanel', {
							olmap : map,
							x : 0,
							y : 0,
							width : 612,
							height : 550,
							layout : 'absolute',
							bodyBorder : false,
							bodyCls : 'mapster',
							bodyStyle : {
								border : '1pt dashed #c0c0c0'
							}
						});
						if (mapControls)
							mapster.add(mapControls);

						/* Grid Host for My Places */
						var featuresPanel = Ext.create('Ext.tab.Panel', {
							width : 612,
							height : 364,
							/*
							 * bodyStyle: { border: '1pt solid red' },
							 */
							x : 63,
							y : 280
						});
						parts['Drawer']['S'] = featuresPanel;
						parts['S'] = featuresPanel;

						/* Sample Form Content */
						var adaptedWebForm = this.adaptWebForm();

						/* Some checkboxes for fun */

						/* Some Fields for Register Unit */

						function handleScroll() {
							console.log("SCROLLERCOASTER");
						}

						var typeSelection = {
							x : 216,
							y : 152,
							width : 460,
							height : 62,
							layout: 'absolute',
							items : [ {
								x: 2, y: 0,
								xtype: 'checkbox',
								name : 'ytt',
								inputValue : false,
								id : 'checkbox1'
							},{
								x: 2, y: 16,
								xtype: 'checkbox',
								name : 'vjl',
								inputValue : false,
								id : 'checkbox2'
							}, {
								x: 2, y: 48,
								xtype: 'checkbox',
								
								name : 'muu',
								inputValue : false,
								id : 'checkbox3'
							},{
								x: 180, y: 0,
								xtype: 'checkbox',
								
								name : 'ktm',
								inputValue : false,
								id : 'checkbox4'
							},{
								x: 180, y: 16,
								xtype: 'checkbox',
								
								name : 'vtv',
								inputValue : false,
								id : 'checkbox5'
							},{
								x: 362, y: 0,
								xtype: 'checkbox',
								
								name : 'hlk',
								inputValue : false,
								id : 'checkbox6'
							} ],
							baseCls: 'transparent',
							bodyStyle : {
								border : '1pt dashed #c0c0c0'
							}
						};

						var registerUnitPanel = {
							bodyStyle : {
								border : '1pt dashed #c0c0c0'
							},
							y : 320,
							x : 224,
							width : 400,
							height : 24,
							layout : 'hbox',
							items : [
									adaptedWebForm.getFormView().fields.tf_CU_identifier,
									{
										xtype : 'button',
										text : 'Hae',
										handler : function() {
											adaptedWebForm
													.getApp()
													.getWorker()
													.searchAnyByCUQualifiedIdentifier(
															adaptedWebForm
																	.getFormView().fields.tf_CU_identifier
																	.getValue(),

															{

																zoomToExtent : true

															});

										}

									},
									{
										xtype : 'button',
										text : 'Osoita kartalta',
										handler : function() {
											
										console.log("HACK","update OpenLayers SIZE"); var
										  mapmodule =
											  adaptedWebForm.getApp()
												.getLayerManager().sandbox.findRegisteredModuleInstance('MainMapModule');
										  	mapmodule._map.updateSize();
										
										
											adaptedWebForm.getApp()
													.getLayerManager()
													.highlightMapLayer();

										}

									} ]
						};

						var pageA = {
							title: 'Sivu 1',
							layout : 'absolute',
							width : 700,
							height : 991,
							bodyCls : 'page-a',
							autoScroll : false,
							style: {
								overflow: 'auto'
							},
							items : [ {
								x : 63,
								y : 416,
								width : 612,
								height : 550,
								items : [ mapster ]
							}, registerUnitPanel, typeSelection,{
								xtype: 'checkbox',
								x: 63, 
								y: 977,
								text: '(EUPL) 2012 oskari.org'
							}]
						};

						var pageB = {
							title: 'Sivu 2',
							width : 700,
							height : 991,
							bodyCls : 'page-b',
							layout : 'absolute',
							items : [ featuresPanel ],
							autoScroll : false,
							style: {
								overflow: 'auto'
							}

						};

						var pageC = {
							title: 'Sivu 3',
							width : 700,
							height : 991,
							bodyCls : 'page-c',
							autoScroll : false,
							style: {
								overflow: 'auto'
							}
						};
						
						var pageD = {
								title: 'Sivu 4',
								width : 700,
								height : 991,
								bodyCls : 'page-d',
								autoScroll : true,
								layout: 'absolute',
								style: {
									overflow: 'auto'
								},
								items: [{
									x: 63,
									y: 190,
									width : 612,
									height : 754,
									items:[adaptedWebForm.getFormView().grids['RakennuksenOminaisuustiedot']]
								}]
							};

						var mapsterContainer = Ext.create('Ext.tab.Panel', {
							// layout : 'absolute',
							autoScroll : true,
							items : [ pageA, pageB, pageC, pageD ]

						});

						/*mapsterContainer.on('bodyscroll', handleScroll);*/

						return mapsterContainer;
					},

					createStatusBar : function(sandbox, mapConfigurations) {
						var bottomTools = [];

						bottomTools.push('-');
						/*
						 * { // xtype: 'button', // default for Toolbars text:
						 * 'Button' });
						 */

						/**
						 * placeholder for status tools
						 */
						var statusDocked = Ext.create('Ext.toolbar.Toolbar', {
							dock : 'bottom',
							items : bottomTools
						});

						;
						return statusDocked;
					},

					createEastPanel : function(sandbox) {
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
							layoutConfig : {
								// layout-specific configs go here
								titleCollapse : false,
								animate : true,
								activeOnTop : true
							},
							width : 220,
							items : eastItems,
							collapsed : eastItems.length == 0
						});

						return eastPanel;
					},

					createSouthPanel : function(sandbox, mapConfigurations) {

						var gridModuleHeight = 200;

						/* UI SOUTH * */

						var southItems = this
								.getExtensionModuleComponentsByRegion( {
									'S' : true
								});

						var southPanel = Ext.create('Ext.tab.Panel', {
							layout : 'fit',
							height : 312,
							width : 480,
							frame : true,
							header : false,
							items : southItems
						});

						return southPanel;
					},

					/**
					 * @method createFlyouts
					 */
					createFlyouts : function(sandbox, mainItems, mediator) {

						/**
						 * NOTE: Proof-of-Concept. Do not copy-paste-modify as
						 * is
						 */

						var me = this;

						var toolstpl = '<em id="{id}-btnWrap" class="toolsbar">'
								+ '<button class="toolsbar" id="{id}-btnEl" type="{type}" hidefocus="true"'
								+ '<tpl if="tabIndex"> tabIndex="{tabIndex}"</tpl> role="button" autocomplete="off">'
								+ '<span id="{id}-btnInnerEl" class="{baseCls}-inner" style="{innerSpanStyle}">'
								+ '{text}'
								+ '</span>'
								+ '<span id="{id}-btnIconEl" class="{baseCls}-icon {iconCls}">&#160;</span>'
								+ '</button>' + '</em>';

						/**
						 * left logo panel
						 */
						mainItems.push( {
							xtype : 'button',
							width : 40,
							flex : 0,
							baseCls : 'toolsbar',
							iconCls : 'toolsbarIcon',
							renderTpl : toolstpl,
							tooltip : 'close_menu',
							handler : function() {

								mediator.lastOpener = null;
								mediator.toolsMenu.hide();

							}
						});

						var bndlstpl = '<em id="{id}-btnWrap" class="bndlsbar-btn">'
								+ '<button class="bndlsbar-btn  {iconCls}" id="{id}-btnEl" type="{type}" hidefocus="true"'
								+ '<tpl if="tabIndex"> tabIndex="{tabIndex}"</tpl> role="button" autocomplete="off">'
								+ '<span id="{id}-btnInnerEl" class="{baseCls}-inner" style="{innerSpanStyle}">'
								+ '{text}'
								+ '</span>'
								+ '<span id="{id}-btnIconEl" class="{baseCls}-icon">&#160;</span>'
								+ '</button>' + '</em>';

						/** left tool icons * */

						var bundleButtons = Ext.create('Ext.panel.Panel', {
							xtype : 'panel',
							width : 120,
							baseCls : 'bndlsbar',
							layout : {
								type : 'vbox',
								align : 'stretch'
							},
							items : [
									{
										xtype : 'panel',
										height : 96,
										baseCls : 'bndlsplaceholder'
									},
									{
										xtype : 'button',
										text : 'Karttatasot',

										height : 96,
										baseCls : 'bndlsbar',
										iconCls : 'bndls-layerselector',
										renderTpl : bndlstpl,
										tooltip : 'show_layerselector',
										handler : function() {
											if (mediator.lastOpener == 0) {
												mediator.toolsMenu.hide();
												mediator.lastOpener = null;
											} else {

												mediator.toolsMenu.show();
												mediator.toolsMenuRight
														.getLayout()
														.setActiveItem(0);
												mediator.lastOpener = 0;
											}
										}
									},
									{
										xtype : 'button',
										text : 'Valitut karttatasot',

										height : 96,
										baseCls : 'bndlsbar',
										iconCls : 'bndls-layerselection',
										renderTpl : bndlstpl,
										tooltip : 'show_layerselection',
										handler : function() {
											if (mediator.lastOpener == 1) {
												mediator.toolsMenu.hide();
												mediator.lastOpener = null;
											} else {
												mediator.toolsMenu.show();

												mediator.toolsMenuRight
														.getLayout()
														.setActiveItem(1);
												mediator.lastOpener = 1;
											}
										}
									} ]
						});

						mediator.bundleButtonsTpl = bndlstpl;
						mediator.bundleButtons = bundleButtons;

						mainItems.push(bundleButtons);

						return mainItems;

					},

					/**
					 * @method createToolsMenu
					 * 
					 * creates lefthandside toolstrip
					 * 
					 */
					createToolsMenu : function(sandbox, allMenuPanels) {
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
							toolsMenuShown : false
						};

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
							height : 480,
							x : 40 + 120,
							y : 96,
							closable : false,
							resizable : true,
							resizeHandles : 'se',
							bodyBorder : false,
							border : 0,
							items : [ toolsMenuRight ],
							bodyCls : 'toolsmenu'
						});

						mediator.toolsMenu = toolsMenu;

						return mediator;
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
								bodyBorder : false,
								items : []
							});

						}

						var mainItems = [];

						var mediator = this.createToolsMenu(sandbox,
								allMenuPanels);

						this.createFlyouts(sandbox, mainItems, mediator);

						/** map * */
						mainItems.push(pnl);

						/** right bundles bar * */

						var eastPanel = this.createEastPanel(sandbox);
						mainItems.push( {
							layout : 'fit',
							xtype : 'panel',
							width : 312,
							items : [ eastPanel ]
						});

						var statusDocked = this.createStatusBar(sandbox,
								mapConfigurations);

						var viewport = Ext.create('Ext.Panel', {
							layout : {
								type : 'hbox',
								align : 'stretch'
							},
							id : 'main-app',
							bodyCls : 'main-app',
							bodyBorder : false,
							items : mainItems,
							bbar : statusDocked
						});

						var container = Ext.create('Ext.container.Viewport', {
							layout : 'fit',
							items : [ viewport ]
						});

						var parts = {
							'Drawer' : {},
							'E' : eastPanel,
							'Viewport' : viewport,
							'ToolsMenu' : mediator.toolsMenu,
							'StatusRegion' : statusDocked,
							'BundleButtons' : mediator.bundleButtons,
							'BundleButtonsTpl' : mediator.bundleButtonsTpl
						};

						var mapster = this.createWebFormContainer(parts,
								this._mapModuleDom, this._mapControlsDom);
						pnl.add(mapster);

						/**
						 * Publish UI parts as Facade
						 */
						this._facade = Oskari.clazz.create(
								'Oskari.mapframework.oskari.ui.WebFormFacade',
								sandbox, this, parts);

						/**
						 * TEMP hack
						 */
						Oskari.$("UI.facade", this._facade);

						this._uiReady = true;
					},

					getFacade : function() {
						return this._facade;
					}

				},
				{
					"protocol" : [ "Oskari.mapframework.module.Module",
							"Oskari.mapframework.bundle.extension.Extension",
							"Oskari.mapframework.bundle.extension.EventListener" ]
				});
