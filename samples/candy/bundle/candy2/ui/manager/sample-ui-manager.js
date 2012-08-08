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
						plugins.push('Oskari.mapframework.bundle.mapmodule.plugin.LayersPlugin');
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
