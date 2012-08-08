/* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 11:38:01 GMT+0300 (Suomen kesäaika)) */ 
/**
 * @class Oskari.poc.extjs.bundle.LayerSelectionBundleInstance
 */
Oskari.clazz.define("Oskari.poc.extjs.bundle.FlyoutAdapterBundleInstance", function() {
	this.map = null;
	this.core = null;
	this.sandbox = null;
	this.mapmodule = null;
	this.started = false;
	this.facade = null;
	this.parts = {};
	this._uimodules = [];
	this._uimodulesByName = {};
	this.extensions = [];
	this.extensionsByName = {};

}, {
	/**
	 * @static
	 * @property __name
	 *
	 */
	__name : 'Oskari.poc.extjs.bundle.FlyoutAdapterBundleInstance',
	"getName" : function() {
		return this.__name;
	},
	/**
	 * @method getSandbox
	 */
	getSandbox : function() {
		return this.sandbox;
	},
	/**
	 * @method implements BundleInstance start methdod
	 *
	 */
	"start" : function() {
		if(this.started)
			return;

		this.started = true;

		var sandbox = Oskari.$("sandbox");

		this.sandbox = sandbox;

		this.facade = Oskari.clazz.create('Oskari.poc.extjs.ui.OskariDIVManagerFacade', sandbox, this, this.parts);

		Oskari.$("UI.facade", this.facade);

		sandbox.register(this);

		for(p in this.eventHandlers) {
			sandbox.registerForEventByName(this, p);
		}

	},
	"init" : function() {
		return null;
	},
	/**
	 * @method update
	 *
	 * implements bundle instance update method
	 */
	"update" : function() {

	},
	/**
	 * @method onEvent
	 */
	onEvent : function(event) {

		var handler = this.eventHandlers[event.getName()];
		if(!handler)
			return;

		return handler.apply(this, [event]);

	},
	/**
	 * @property eventHandlers
	 * @static
	 *
	 */
	eventHandlers : {

	},

	"addExtensionModule" : function(module, identifier, eventHandlers, bundleInstance, regionDef, loc, comp) {

		var sandbox = this.sandbox;
		var lang = sandbox.getLanguage();

		var name = module.getName();
		var title = loc.fi.title;

		var def = {
			module : module,
			identifier : identifier,
			region : regionDef,
			component : comp
			// setup in setupExtensionModules see above
		};
		this._uimodules.push(def);
		this._uimodulesByName[identifier] = def;

		def.bundleInstance = bundleInstance;
		if(def.module) {
			if(def.component)
				def.initialisedComponent = this.getSandbox().register(def.module);
			else
				def.component = this.getSandbox().register(def.module);

		}

		/*
		 * register events
		 */
		for(p in eventHandlers) {
			this.sandbox.registerForEventByName(module, p);
		}

		var extension = Oskari.clazz.create('Oskari.poc.extjs.flyoutadapter.Extension', this, {
			name : name,
			title : title,
			description : '?'
		}, def);

		this.extensions.push(extension);
		this.extensionsByName[extension.getName()] = extension;

		var request = sandbox.getRequestBuilder('userinterface.AddExtensionRequest')(extension);
		sandbox.request(this, request);

		console.log("FLYOUTADAPTER", extension);

		return def;

	},
	/**
	 * @method stop
	 *
	 * implements bundle instance stop method
	 */
	"stop" : function() {

		var sandbox = this.sandbox;
		for(p in this.eventHandlers) {
			sandbox.unregisterFromEventByName(this, p);
		}

		var remove = sandbox.getRequestBuilder('userinterface.RemoveExtensionRequest');

		for(var n = 0; n < this.extensions.length; n++) {
			var request = remove(this.extensions[n]);
			sandbox.request(this, request);
		}

		this.extensions = [];
		this.extensionsByname = {};

		sandbox.request(this, request);

		this.sandbox.unregister(this);
		this.started = false;
	}
}, {
	"protocol" : ["Oskari.bundle.BundleInstance", 'Oskari.mapframework.module.Module']
});
/**
 * @class Oskari.poc.jqueryui.layerselection.Flyout
 */
Oskari.clazz.define('Oskari.poc.extjs.flyoutadapter.Flyout',

/**
 * @method create called automatically on construction
 * @static
 *
 * Always extend this class, never use as is.
 */
function(instance, props, def) {
	this.instance = instance;
	this.container = null;
	this.el = null;
	this.template = null;
	this.state = null;
	this.props = props;
	this.def = def;
}, {
	getName : function() {
		return this.props.name;
	},
	setEl : function(el, width, height) {
		this.container = el[0];

	},
	startPlugin : function() {

		var items = this.def.component ? [this.def.component] : [];

		this.el = Ext.create('Ext.panel.Panel', {
			renderTo : this.container,
			bodyBorder : false,
			bodyCls : 'oskari',
			bodyStyle : {
				border : '1pt dashed #c0c0c0',
				padding : '16px',
				margin : '16px'
			},
			layout : 'fit',
			width : 636,
			height : 420,
			items : items
		});
	},
	stopPlugin : function() {
		this.container.empty();
	},
	getTitle : function() {
		return this.props.title;
	},
	getDescription : function() {
		return this.props.description;
	},
	getOptions : function() {

	},
	setState : function(state) {

	},
	refresh : function() {

	}
}, {
	'protocol' : ['Oskari.userinterface.Flyout']
});
/**
 * @class Oskari.poc.jqueryui.layerselection.Tile
 */
Oskari.clazz.define('Oskari.poc.extjs.flyoutadapter.Tile',

/**
 * @method create called automatically on construction
 * @static
 *
 * Always extend this class, never use as is.
 */
function(instance, props, def) {
	this.instance = instance;
	this.container = null;
	this.template = null;
	this.props = props;
	this.def = def;

}, {
	getName : function() {
		return this.props.name;
	},
	setEl : function(el, width, height) {
		this.container = el;
	},
	startPlugin : function() {
	},
	stopPlugin : function() {

	},
	getTitle : function() {
		return this.props.title;
	},
	getDescription : function() {
	},
	getOptions : function() {

	},
	setState : function(state) {

	}
}, {
	'protocol' : ['Oskari.userinterface.Tile']
});
Oskari.clazz.define('Oskari.poc.extjs.flyoutadapter.Extension', function(instance, props, def) {
	this.instance = instance;
	this.props = props;
	this.plugins = {};
	this.def = def;

}, {

	getName : function() {
		return this.props.name;
	},
	setSandbox : function(sandbox) {
		this.sandbox = sandbox;
	},
	startExtension : function() {
		this.plugins['Oskari.userinterface.Flyout'] = Oskari.clazz.create('Oskari.poc.extjs.flyoutadapter.Flyout', this, this.props, this.def);
		this.plugins['Oskari.userinterface.Tile'] = Oskari.clazz.create('Oskari.poc.extjs.flyoutadapter.Tile', this, this.props, this.def);
	},
	stopExtension : function() {
		
		this.def.bundleInstance.stop();
		
		this.def = null;
	},
	getTitle : function() {
		return this.props.title;
	},
	getDescription : function() {
		return this.props.description;
	},
	getPlugins : function() {
		return this.plugins;
	}
});
Oskari.clazz.define('Oskari.poc.extjs.ui.OskariDIVManagerFacade',

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

	
		var def = this.manager.addExtensionModule(module, identifier, eventHandlers,
				bundleInstance, regionDef, loc, comp);

		

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
