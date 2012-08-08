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
