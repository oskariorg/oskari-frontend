/* This is a unpacked Oskari bundle (bundle script version Mon Feb 27 2012 09:45:18 GMT+0200 (Suomen normaaliaika)) */ 
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
Oskari.clazz.define('Oskari.mapframework.ui.manager.mapportal.MapPortalUiManager',

/**
 * @constructor
 *
 * Creates an UI Manager manager for Portlet oriented UI
 *
 */
function(conf) {

	/** Sandbox */
	this._sandbox

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

}, {

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
		/* extension modules */
		this.setupExtensionModules(sandbox);
		/*
		 * Modules created, next build up EXTjs Frame and fit
		 * modules to that. Yes, it is that simple.
		 */
		sandbox.printDebug("All modules created, next build up EXTJs frame...");
		this.createUi(sandbox);
		sandbox.printDebug("Map full UI construction completed.");
	},
	/**
	 * @method setupExtensionModules
	 * @private
	 *
	 * Let's register module to sandbox (internal)
	 */
	setupExtensionModules : function(sandbox) {
		sandbox.printDebug("setupExtensionModules...");

		for(var n = 0; n < this._uimodules.length; n++) {
			var def = this._uimodules[n];
			if(!def.module)
				continue;
			sandbox.printDebug("#*+---- registering ----+*#" + def.identifier);

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
	addExtensionModule : function(module, identifier, regionDef, loc, comp) {
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
	getExtensionModuleComponentsByRegion : function(regionSelector) {
		var sandbox = this._sandbox;
		var results = [];
		var dbgStr = "";
		for(p in regionSelector) {
			dbgStr += p + "=" + regionSelector[p] + " ";
		}
		sandbox.printDebug("getExtensionModulesByRegion called with " + dbgStr);
		for(var n = 0; n < this._uimodules.length; n++) {
			var def = this._uimodules[n];
			if(!def.component)
				continue;
			if(regionSelector[def.region]) {
				results.push(def.component);
				sandbox.printDebug("- module " + def.identifier + " matched");
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
	getExtensionModuleDefinitionsByRegion : function(regionSelector) {
		var results = [];
		for(var n = 0; n < this._uimodules.length; n++) {
			var def = this._uimodules[n];
			if(regionSelector[def.region])
				results.push(def);
		}

		return results;
	},
	createSouthPanel : function(sandbox, mapConfigurations, gridModuleHeight) {
		var southItems = this.getExtensionModuleComponentsByRegion({
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
			// id : 'main-app-bottom',
			height : gridModuleHeight,
			boxMinHeight : gridModuleHeight,
			// width : mapConfigurations.width,
			animCollapse : false,
			titleCollapse : false,
			frame : true,
			header : false,
			items : southItems

		});

		this.facadeParts['S'] = southPanel;

		return southPanel;
	},
	createEastPanel : function(sandbox, mapConfigurations) {
		var eastItems = this.getExtensionModuleDefinitionsByRegion({
			'E' : true
		});

		var eastPortletItems = [];
		for(var n = 0; n < eastItems.length; n++) {
			var def = eastItems[n];
			eastPortletItems.push({
				title : def.loc ? def.loc[lang].title : '?',
				height : 256,
				items : def.component
			});
		}

		var eastPortalPanel = Ext.create('Ext.app.PortalPanel', {
			xtype : 'portalpanel',
			items : [{
				// id : 'col-2',
				items : eastPortletItems
			}]
		});

		var eastPortlets = [eastPortalPanel];

		var eastPanel = Ext.create('Ext.Panel', {
			region : 'east',
			width : 312,
			collapsible : true,
			collapsed : true,
			split : true,
			layout : 'fit',
			items : eastPortlets,
			collapseMode : 'mini',
			animCollapse : false

		});

		this.facadeParts['Portlet']['E'] = eastPortalPanel;
		this.facadeParts['Drawer']['E'] = eastPanel;

		return eastPanel;
	},
	createWestPanel : function(sandbox, mapConfigurations) {
		var westPanelItems = [];

		var nwItems = this.getExtensionModuleDefinitionsByRegion({
			'NW' : true
		});

		var northWestPanel = Ext.create('Ext.Panel', {
			height : 256,
			layout : 'fit',
			items : nwItems
		});

		this.facadeParts['NW'] = northWestPanel;

		westPanelItems.push(northWestPanel);

		var westItems = this.getExtensionModuleDefinitionsByRegion({
			'W' : true
		});

		var westPortletItems = [];

		for(var n = 0; n < westItems.length; n++) {
			var def = westItems[n];

			if(!def.component)
				continue;

			westPortletItems.push({
				title : def.loc ? def.loc[lang].title : '?',
				height : 512,
				items : def.component
			});
		}

		var westPortalPanel = Ext.create('Ext.app.PortalPanel', {
			flex : 1,
			xtype : 'portalpanel',
			items : [{
				// id : 'col-1',
				items : westPortletItems
			}]
		});

		westPanelItems.push(westPortalPanel);

		var westPanel = Ext.create('Ext.panel.Panel', {
			region : 'west',
			split : true,
			layout : {
				type : 'vbox',
				align : 'stretch',
				pack : 'start'
			},
			items : westPanelItems,
			// id : 'main-left-panel',
			collapseMode : 'mini',
			collapsed : true,
			border : false,
			frame : false,
			width : 312,
			region : 'west',
			collapsible : true,
			animCollapse : false,
			split : true,
			animCollapse : false,
			titleCollapse : false,
			autoHeight : false,
			boxMaxWidth : 600,
			boxMinWidth : 220,
			hidden : !mapConfigurations.plane_list,
			title : sandbox.getText("leftpanel_maplevels_title")
		});

		this.facadeParts['Portlet']['W'] = westPortalPanel;
		this.facadeParts['Drawer']['W'] = westPanel;

		return westPanel;
	},
	createCenterPanel : function(sandbox, mapConfigurations) {
		var centerItems = this.getExtensionModuleComponentsByRegion({
			'Center' : true
		});

		var centerPanel = Ext.create('Ext.Panel', {
			region : 'center',
			// split : true,
			items : centerItems,
			// id : 'main-center',
			// border : false,
			layout : 'fit',
			// frame : false,
			header : false,
			collapsible : false,
			animCollapse : false,
			titleCollapse : false
		});
		this.facadeParts['Center'] = centerPanel;

		return centerPanel;
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

		var gridModuleHeight = 300;

		/** UI SOUTH * */
		var southPanel = this.createSouthPanel(sandbox, mapConfigurations, gridModuleHeight);

		/*
		*
		*/
		/**
		 * UI NORTH
		 */
		/*
		* var northItems =
		* this.getExtensionModuleDefinitionsByRegion( { 'N' :
		* true });
		*
		* var northPortletItems =[]; for( var n = 0 ; n<
		* northItems.length;n++) { var def = northItems[n];
		* northPortletItems.push({ title: def.loc?
		* def.loc[lang].title : '?', height: 64, collapsible:
		* false, items: def.component }); }
		*
		* var northPortlets = [{ xtype: 'portalpanel', items: [{
		* id: 'col-2', items: northPortletItems }] }];
		*
		* var northPanel = Ext.create('Ext.Panel', { region :
		* 'north', height: 96, //collapsible : true,
		* //collapsed: false, //split : true, layout : 'fit',
		* items : northPortlets //collapseMode : 'mini' });
		*/

		/**
		 * UI EAST
		 */
		var eastPanel = this.createEastPanel(sandbox, mapConfigurations);

		/**
		 * UI WEST
		 */
		var westPanel = this.createWestPanel(sandbox, mapConfigurations);

		/**
		 * UI MAIN (center)
		 */

		var centerPanel = this.createCenterPanel(sandbox, mapConfigurations);

		/**
		 * Create viewport, where border layout is used
		 */

		var mainItems = [];
		if(westPanel)
			mainItems.push(westPanel);

		mainItems.push(centerPanel);

		if(eastPanel)
			mainItems.push(eastPanel);

		var statusDocked = this.createStatusBar(sandbox, mapConfigurations);
		this.facadeParts['StatusRegion'] = statusDocked;

		/**
		 *
		 */
		var viewportCenterPanel = Ext.create('Ext.Panel', {
			layout : 'border',
			region : 'center',
			items : mainItems,
			bbar : statusDocked
		});
		this.facadeParts['ViewportCenter'] = viewportCenterPanel;

		var bundleMenu = this.getBundleMenu();

		/*
		 * Container for all UI items
		 */
		var viewport = Ext.create('Ext.Panel', {
			layout : 'border',
			// id : 'main-app',
			// width : mapConfigurations.width,
			/*
			* height : mapConfigurations.height +
			* gridModuleHeight,
			*/
			// split : true,
			items : [viewportCenterPanel, southPanel],

			tbar : [{
				xtype : 'splitbutton',
				text : 'Bundle',
				scale : 'large',
				minWidth : 64,
				iconAlign : 'top',
				arrowAlign : 'bottom',
				menu : bundleMenu
			}]

		});

		this.facadeParts['Viewport'] = viewport;

		/**
		 * Show UI in full Browser Window
		 */
		Ext.create('Ext.container.Viewport', {
			style : {
				padding : '8px',
				overflow : 'hidden'
			},
			layout : 'fit',
			items : [viewport]
		});

		/**
		 * Publish UI parts as Facade
		 */
		this._facade = Oskari.clazz.create('Oskari.mapframework.ui.manager.mapportal.Facade', sandbox, this, this.facadeParts);

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
				fcd.require({
					"Import-Bundle" : {
						"bundlemanager" : {
							bundlePath : "../example-bundles/bundle/"
						}
					}
				}, function(manager) {

					Oskari.bundle_facade.requireBundle("bundlemanager", "BundleManager", function() {
						var yy = manager.createInstance("BundleManager");

						yy.start()

					});
				});
			}
		}];

	}
});
Oskari.clazz.define('Oskari.mapframework.ui.manager.mapportal.Facade',

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
	appendExtensionModule : function(module, identifier, eventHandlers, bundleInstance, regionDef, loc, comp) {

		var lang = this.sandbox.getLanguage();

		var def = this.manager.addExtensionModule(module, identifier, regionDef, loc, comp);

		def.bundleInstance = bundleInstance;
		if(def.module) {
			if(def.component)
				def.initialisedComponent = this.getSandbox().register(def.module);
			else
				def.component = this.getSandbox().register(def.module);

		}

		if(def.component) {

			var region = null;

			var isPortlet = true;

			if( typeof regionDef == "string") {
				region = regionDef;
			}
			isPortlet = this.parts['Portlet'][region];

			if(isPortlet) {
				var portlet = {
					border : false,
					title : def.loc[lang].title,
					xtype : 'portlet',
					layout : 'fit',
					items : [def.component],
					tools : [{
						type : 'gear',

						handler : function(event, toolEl, panel) {
							def.bundleInstance.config();
						}
					}],
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

				var partHost = this.parts['Drawer'][region];
				partHost.expand(false);

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
		for(p in eventHandlers) {
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
			comp : component
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
	removeExtensionModule : function(module, identifier, eventHandlers, bundleInstance, def) {
		/*
		 * unregister events
		 */
		for(p in eventHandlers) {
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
		this.parts['Drawer'][part].collapse(this.collapseDirections[part], false);
	},
	/**
	 * @method expandPart
	 */
	expandPart : function(part) {
		this.parts['Drawer'][part].expand(false);
	}
}, {
	'protocol' : ['Oskari.mapframework.ui.manager.Facade']
});
