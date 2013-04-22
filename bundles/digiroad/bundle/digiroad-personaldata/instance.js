/**
 * @class Oskari.digiroad.bundle.personaldata.PersonalDataBundleInstance
 *
 * Main component and starting point for the personal data functionality.
 * 
 * See Oskari.digiroad.bundle.personaldata.PersonalDataBundle for bundle definition. 
 */
Oskari.clazz.define("Oskari.digiroad.bundle.personaldata.PersonalDataBundleInstance", 

/**
 * @method create called automatically on construction
 * @static
 */
function() {
	this.core = null;
	this.sandbox = null;
	this.started = false;
	this.template = null;
	this.plugins = {};
	this.viewService = null;
}, {
	/**
	 * @static
	 * @property __name
	 */
	__name : 'DigiroadPersonalData',
	/**
	 * @method getName
	 * @return {String} the name for the component 
	 */
	"getName" : function() {
		return this.__name;
	},
	/**
	 * @method setSandbox
	 * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
	 * Sets the sandbox reference to this component
	 */
	setSandbox : function(sandbox) {
		this.sandbox = sandbox;
	},
	/**
	 * @method getSandbox
	 * @return {Oskari.mapframework.sandbox.Sandbox}
	 */
	getSandbox : function() {
		return this.sandbox;
	},
	/**
	 * @method getViewService
	 * @return {Oskari.mapframework.bundle.personaldata.service.ViewService}
	 */
	getViewService : function() {
		return this.viewService;
	},
    /**
     * @method getLocalization
     * Returns JSON presentation of bundles localization data for current language.
     * If key-parameter is not given, returns the whole localization data.
     * 
     * @param {String} key (optional) if given, returns the value for key
     * @return {String/Object} returns single localization string or
     * 		JSON object for complete data depending on localization
     * 		structure and if parameter key is given
     */
    getLocalization : function(key) {
    	if(!this._localization) {
    		this._localization = Oskari.getLocalization(this.getName());
    	}
    	if(key) {
    		return this._localization[key];
    	}
        return this._localization;
    },
	/**
	 * @method start
	 * implements BundleInstance protocol start methdod
	 */
	"start" : function() {
		var me = this;

		if(me.started)
			return;

		me.started = true;

		var sandbox = Oskari.$("sandbox");
		me.sandbox = sandbox;
		this.viewService = Oskari.clazz.create('Oskari.digiroad.bundle.personaldata.service.ViewService', sandbox.getAjaxUrl());

		sandbox.register(me);
		for(p in me.eventHandlers) {
			sandbox.registerForEventByName(me, p);
		}

		//Let's extend UI
		var request = sandbox.getRequestBuilder('userinterface.AddExtensionRequest')(this);

		sandbox.request(this, request);

		// draw ui
		me.createUi();
	},
	/**
	 * @method init
	 * implements Module protocol init methdod - does nothing atm
	 */
	"init" : function() {
		return null;
	},
	/**
	 * @method update
	 * implements BundleInstance protocol update method - does nothing atm
	 */
	"update" : function() {

	},
	/**
	 * @method onEvent
	 * @param {Oskari.mapframework.event.Event} event a Oskari event object
	 * Event is handled forwarded to correct #eventHandlers if found or discarded if not.
	 */
	onEvent : function(event) {

		var handler = this.eventHandlers[event.getName()];
		if(!handler)
			return;

		return handler.apply(this, [event]);

	},
    /**
     * @property {Object} eventHandlers
     * @static
     */
	eventHandlers : {
	},

	/**
	 * @method stop
	 * implements BundleInstance protocol stop method
	 */
	"stop" : function() {
		var sandbox = this.sandbox();
		for(p in this.eventHandlers) {
			sandbox.unregisterFromEventByName(this, p);
		}

		var request = sandbox.getRequestBuilder('userinterface.RemoveExtensionRequest')(this);

		sandbox.request(this, request);

		this.sandbox.unregister(this);
		this.started = false;
	},
	/**
	 * @method startExtension
	 * implements Oskari.userinterface.Extension protocol startExtension method
	 * Creates a flyout and a tile:
	 * Oskari.mapframework.bundle.personaldata.Flyout
	 * Oskari.mapframework.bundle.personaldata.Tile
	 */
	startExtension : function() {
		this.plugins['Oskari.userinterface.Flyout'] = Oskari.clazz.create('Oskari.digiroad.bundle.personaldata.Flyout', this);
		this.plugins['Oskari.userinterface.Tile'] = Oskari.clazz.create('Oskari.digiroad.bundle.personaldata.Tile', this);
	},
	/**
	 * @method stopExtension
	 * implements Oskari.userinterface.Extension protocol stopExtension method
	 * Clears references to flyout and tile
	 */
	stopExtension : function() {
		this.plugins['Oskari.userinterface.Flyout'] = null;
		this.plugins['Oskari.userinterface.Tile'] = null;
	},
	/**
	 * @method getPlugins
	 * implements Oskari.userinterface.Extension protocol getPlugins method
	 * @return {Object} references to flyout and tile
	 */
	getPlugins : function() {
		return this.plugins;
	},
	/**
	 * @method getTitle 
	 * @return {String} localized text for the title of the component 
	 */
	getTitle : function() {
		return this.getLocalization('title');
	},
	/**
	 * @method getDescription 
	 * @return {String} localized text for the description of the component 
	 */
	getDescription : function() {
		return this.getLocalization('desc');
	},
	/**
	 * @method createUi
	 * (re)creates the UI for "personal data" functionality
	 */
	createUi : function() {
		var me = this;

		this.plugins['Oskari.userinterface.Flyout'].createUi();
		this.plugins['Oskari.userinterface.Tile'].refresh();
	}
}, {
	/**
	 * @property {String[]} protocol
	 * @static 
	 */
	"protocol" : ["Oskari.bundle.BundleInstance", 'Oskari.mapframework.module.Module', 'Oskari.userinterface.Extension']
});
