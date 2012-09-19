/**
 * @class Oskari.mapframework.bundle.toolbar.ToolbarBundleInstance
 *
 * Main component and starting point for the "toolbar" functionality.
 * Provides functionality for other bundles to add buttons
 * for different functionalities
 *
 * See Oskari.mapframework.bundle.toolbar.ToolbarBundle for bundle definition.
 */
Oskari.clazz.define("Oskari.mapframework.bundle.toolbar.ToolbarBundleInstance",

/**
 * @method create called automatically on construction
 * @static
 */
function() {
	this.sandbox = null;
	this.started = false;
	this.buttons = {};
	this.selectedButton = null;
	this.defaultButton = null;
	this.container = null;
}, {
	/**
	 * @static
	 * @property __name
	 */
	__name : 'Toolbar',

	/**
	 * @method getName
	 * @return {String} the name for the component
	 */
	getName : function() {
		return this.__name;
	},
	/**
	 * @method setSandbox
	 * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
	 * Sets the sandbox reference to this component
	 */
	setSandbox : function(sbx) {
		this.sandbox = sbx;
	},
	/**
	 * @method getSandbox
	 * @return {Oskari.mapframework.sandbox.Sandbox}
	 */
	getSandbox : function() {
		return this.sandbox;
	},
	/**
	 * @method update
	 * implements BundleInstance protocol update method - does nothing atm
	 */
	update : function() {
	},
	/**
	 * @method start
	 * implements BundleInstance protocol start methdod
	 */
	start : function() {
		var me = this;
		if(me.started) {
			return;
		}
		me.started = true;
		// Should this not come as a param?
		var sandbox = Oskari.$('sandbox');
		sandbox.register(me);
		me.setSandbox(sandbox);

		// TODO: check this with how divmanazer handles things
		this.container = jQuery('#toolbar');

		for(var p in me.eventHandlers) {
			if(p) {
				sandbox.registerForEventByName(me, p);
			}
		}
		sandbox.addRequestHandler('Toolbar.AddToolButtonRequest', this.requestHandlers.toolButtonRequestHandler);
		sandbox.addRequestHandler('Toolbar.RemoveToolButtonRequest', this.requestHandlers.toolButtonRequestHandler);
		sandbox.addRequestHandler('Toolbar.ToolButtonStateRequest', this.requestHandlers.toolButtonRequestHandler);
		sandbox.addRequestHandler('Toolbar.SelectToolButtonRequest', this.requestHandlers.toolButtonRequestHandler);

		/* temporary fix */
		sandbox.addRequestHandler('ShowMapMeasurementRequest', this.requestHandlers.showMapMeasurementRequestHandler);

		sandbox.registerAsStateful(this.mediator.bundleId, this);

		// TODO: check if we want to do this
		if(this._addDefaultButtons) {
			this._addDefaultButtons();
		}
	},
	/**
	 * @method init
	 * implements Module protocol init method - initializes request handlers and templates
	 */
	init : function() {
		var me = this;

		this.templateGroup = jQuery('<div class="toolrow"></div>');
		this.templateTool = jQuery('<div class="tool"></div>');

		this.requestHandlers = {
			toolButtonRequestHandler : Oskari.clazz.create('Oskari.mapframework.bundle.toolbar.request.ToolButtonRequestHandler', me),
			showMapMeasurementRequestHandler : Oskari.clazz.create('Oskari.mapframework.bundle.toolbar.request.ShowMapMeasurementRequestHandler', me)
		};
	},
	/**
	 * @method getToolbarContainer
	 * @return {jQuery} reference to the toolbar container
	 */
	getToolbarContainer : function() {
		return this.container;
	},
	/**
	 * @method onEvent
	 * @param {Oskari.mapframework.event.Event} event a Oskari event object
	 * Event is handled forwarded to correct #eventHandlers if found or discarded if not.
	 */
	onEvent : function(event) {
		var me = this;
		var handler = me.eventHandlers[event.getName()];
		if(!handler) {
			return;
		}

		return handler.apply(this, [event]);
	},
	measureTools : {
		"basictools" : {
			"measureline" : true,
			"measurearea" : true
		}
	},

	/**
	 * @property {Object} eventHandlers
	 * @static
	 */
	eventHandlers : {
		/*
		 * @method ToolSelectedEvent
		 * */
		"Toolbar.ToolSelectedEvent" : function(event) {
			var me = this;
			var sandbox = this.getSandbox();

			if(!me.measureTools[event.getGroupId()]) {
				return;
			}
			if(!me.measureTools[event.getGroupId()][event.getToolId()]) {
				return;
			}

			var msg = me.getLocalization('measure')['guidance'][event.getToolId()];

			sandbox.request(me, sandbox.getRequestBuilder('ShowMapMeasurementRequest')( msg ? msg : "", false, null, null));

		}
	},

	/**
	 * @method stop
	 * implements BundleInstance protocol stop method
	 */
	stop : function() {
		var me = this;
		var sandbox = me.sandbox();
		for(var p in me.eventHandlers) {
			if(p) {
				sandbox.unregisterFromEventByName(me, p);
			}
		}

		/* temporary fix */
		sandbox.removeRequestHandler('ShowMapMeasurementRequest', this.requestHandlers.showMapMeasurementRequestHandler);

		sandbox.removeRequestHandler('Toolbar.AddToolButtonRequest', this.requestHandlers.toolButtonRequestHandler);
		sandbox.removeRequestHandler('Toolbar.RemoveToolButtonRequest', this.requestHandlers.toolButtonRequestHandler);
		sandbox.removeRequestHandler('Toolbar.ToolButtonStateRequest', this.requestHandlers.toolButtonRequestHandler);
		sandbox.removeRequestHandler('Toolbar.SelectToolButtonRequest', this.requestHandlers.toolButtonRequestHandler);

		this.sandbox.unregisterStateful(this.mediator.bundleId);
		me.sandbox.unregister(me);
		me.started = false;
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
	 * @method setState
	 * @param {Object} state bundle state as JSON
	 */
	setState : function(state) {

		if(!state) {
			// TODO: loop buttons and check which had selected = true for default tool
			return;
		}
		if(state.selected) {
			this.selectedButton = state.selected;
			// get references
			var tool = state.selected.id;
			var group = state.selected.group;
			var toolbar = this.getToolbarContainer();

			// remove any old selection
			this._removeToolSelections();

			var groupContainer = toolbar.find('div.toolrow[tbgroup=' + group + ']');
			if(groupContainer.length > 0) {
				var button = groupContainer.find('div.tool[tool=' + tool + ']');
				if(button.length > 0) {
					// select the new one
					button.addClass('selected');
					// "click" the button
					this.buttons[group][tool].callback();
				}
				// if button has not yet been added
				// we should obey the state in add button
			}
		} else {
			this.selectedButton = null;
		}
	},
	/**
	 * @method getState
	 * @return {Object} bundle state as JSON
	 */
	getState : function() {
		var state = {

		};
		if(this.selectedButton) {
			state.selected = this.selectedButton;
		}

		return state;
	}
}, {
	/**
	 * @property {String[]} protocol
	 * @static
	 */
	protocol : ['Oskari.bundle.BundleInstance', 'Oskari.mapframework.module.Module']
});
