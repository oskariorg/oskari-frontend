/* This is a unpacked Oskari bundle (bundle script version Thu Feb 23 2012 11:08:28 GMT+0200 (Suomen normaaliaika)) */ 
Oskari.clazz
		.define(
				"Oskari.mapframework.bundle.WebFormBundleInstance",
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
								.create('Oskari.mapframework.webform.Sample');
						

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
				});Oskari.clazz
		.define(
				'Oskari.mapframework.webform.Sample',
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

					getWmtsService : function() {
						return this.wmtsService;
					},

					/**
					 * kick start
					 */
					startFramework : function() {

						var conf = this.getMapConfiguration();

						var core = Oskari.clazz
								.create('Oskari.mapframework.core.Core');
						this._core = core;
						
						var sandbox = core.getSandbox();

						this.handlers = {
							addExternalMapLayer : Oskari.clazz
									.create(
											'Oskari.mapframework.bundle.AddExternalMapLayerHandler',
											sandbox),
							removeExternalMapLayer : Oskari.clazz
									.create(
											'Oskari.mapframework.bundle.RemoveExternalMapLayerHandler',
											sandbox)

						};

						sandbox.addRequestHandler(
								'AddExternalMapLayerRequest',
								this.handlers.addExternalMapLayer);
						sandbox.addRequestHandler(
								'RemoveExternalMapLayerRequest',
								this.handlers.removeExternalMapLayer);

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

						var mapLayerService = Oskari.clazz.create(
								'Oskari.mapframework.service.MapLayerService',
								null, this._core.getSandbox());
						services.push(mapLayerService);

						/*
						 * We'll register a handler for our type
						 */
						mapLayerService.registerLayerModel('wmtslayer',
								'Oskari.mapframework.wmts.domain.WmtsLayer')

						var layerModelBuilder = Oskari.clazz
								.create('Oskari.mapframework.wmts.service.WmtsLayerModelBuilder');

						mapLayerService.registerLayerModelBuilder('wmtslayer',
								layerModelBuilder);

						/**
						 * We'll need WMTSLayerService
						 */
						var wmtsService = Oskari.clazz
								.create(
										'Oskari.mapframework.wmts.service.WMTSLayerService',
										mapLayerService);
						this.wmtsService = wmtsService;

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
										'Oskari.mapframework.oskari.ui.WebFormUiManager',
										conf, this);

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
Oskari.clazz.define('Oskari.mapframework.oskari.ui.WebFormFacade',

/**
 * @constructor
 * 
 * creates a facade
 */
function(sandbox, manager, parts) {

	this.sandbox = sandbox;
	this.manager = manager;
	this.parts = parts;
	this.additionalComponents = [];
}, {
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

	showUIComponent : function(identifier, component, region) {

		var foundAtIndex = this.findUIComponentIndex(identifier);
		if (foundAtIndex != -1) {
			var compConf = this.additionalComponents[foundAtIndex];
			this.expandPart(compConf.region);
			if ('S' === compConf.region) {
				this.parts[compConf.region].setActiveTab(compConf.comp);
			} else if (compConf.comp.expand) {
				compConf.comp.expand(false);
			}
		}

	},

	/**
	 * @method removeUIComponent
	 * 
	 * removes an added ui component that matches given identifier TODO:
	 * experimental and lacking error handling
	 * 
	 */
	removeUIComponent : function(identifier) {
		var foundAtIndex = this.findUIComponentIndex(identifier);
		if (foundAtIndex != -1) {
			var compConf = this.additionalComponents[foundAtIndex];
			this.parts[compConf.region].remove(compConf.comp);
			this.additionalComponents.splice(foundAtIndex, 1);
		}
	},
	findUIComponentIndex : function(identifier) {
		var foundAtIndex = -1;
		for ( var i = 0; i < this.additionalComponents.length; ++i) {
			var compConf = this.additionalComponents[i];
			if (compConf.ident == identifier) {
				return i;
			}
		}
		return -1;
	},

	/**
	 * @method addUIComponent
	 * 
	 * adds ui component to requested region
	 * 
	 */
	addUIComponent : function(identifier, component, region) {

		// TODO: should we call actual manager instead of manipulating panels
		// here?
		this.parts[region].add(component);

		var compConf = {
			ident : identifier,
			region : region,
			comp : component
		};
		this.additionalComponents[identifier] = compConf;
	},
	/**
	 * @method appendExtensionModule
	 * 
	 * append and register bundle with optional UI component If UI component is
	 * not provided. Module init method should return UI component.
	 * 
	 * Wraps portlet kinds of panels with bundle close operations.
	 * 
	 * Registers events for extension bundle if requested
	 * 
	 */
	appendExtensionModule : function(module, identifier, eventHandlers,
			bundleInstance, regionDef, loc, comp) {

		var lang = this.sandbox.getLanguage();

		var def = this.manager.addExtensionModule(module, identifier,
				regionDef, loc, comp);

		def.bundleInstance = bundleInstance;
		if (def.module) {
			if (def.component)
				def.initialisedComponent = this.getSandbox().register(
						def.module);
			else
				def.component = this.getSandbox().register(def.module);

		}

		if (def.component) {

			var region = null;

			var isPortlet = true;

			if (typeof regionDef == "string") {
				region = regionDef;
			}

			var host = this.parts[region];

			var ttl = null;
			if (loc && loc[lang])
				ttl = loc[lang].title;

			var subcmp = {
				title : ttl,
				layout : 'fit',
				items : [ def.component ]
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
	removeExtensionModule : function(module, identifier, eventHandlers,
			bundleInstance, def) {
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
		if (this.parts['Drawer'][part]) {
			this.parts['Drawer'][part].collapse(this.collapseDirections[part],
					false);
		} else {
			this.parts[part].collapse(true);
		}
	},

	/**
	 * @method expandPart
	 */
	expandPart : function(part) {
		if (this.parts['Drawer'][part]) {
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
						plugins.push('Oskari.mapframework.mapmodule.LayersPlugin');
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
