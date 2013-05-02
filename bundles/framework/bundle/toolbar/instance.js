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
	this.menutoolbarcontainer = null;
	this.containers = {};
	this.toolbars = {};
	this.groupsToToolbars = {};
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
		var conf = me.conf;
		var sandboxName = ( conf ? conf.sandbox : null ) || 'sandbox';
		var sandbox = Oskari.getSandbox(sandboxName);
		sandbox.register(me);
		me.setSandbox(sandbox);

		var defaultContainerId = ( conf ? conf.defaultToolbarContainer : null ) || '#toolbar';
		this.container = jQuery(defaultContainerId);
		this.containers['default'] = this.container;
		this.toolbars['default'] = this.container;

		var defaultMenuToolbarContainer = ( conf ? conf.defaultMenuToolbarContainer : null ) || '#menutoolbar';
		this.menutoolbarcontainer = jQuery(defaultMenuToolbarContainer);

		for(var p in me.eventHandlers) {
			if(p) {
				sandbox.registerForEventByName(me, p);
			}
		}
		sandbox.addRequestHandler('Toolbar.AddToolButtonRequest', this.requestHandlers.toolButtonRequestHandler);
		sandbox.addRequestHandler('Toolbar.RemoveToolButtonRequest', this.requestHandlers.toolButtonRequestHandler);
		sandbox.addRequestHandler('Toolbar.ToolButtonStateRequest', this.requestHandlers.toolButtonRequestHandler);
		sandbox.addRequestHandler('Toolbar.SelectToolButtonRequest', this.requestHandlers.toolButtonRequestHandler);
		sandbox.addRequestHandler('Toolbar.ToolbarRequest', this.requestHandlers.toolbarRequestHandler);

		/* temporary fix */
		sandbox.addRequestHandler('ShowMapMeasurementRequest', this.requestHandlers.showMapMeasurementRequestHandler);

		sandbox.registerAsStateful(this.mediator.bundleId, this);

		// TODO: check if we want to do this
		if(this._addDefaultButtons) {
			this._addDefaultButtons();
		}
	},
	/**
	 * @static
	 * @property templates
	 *
	 *
	 */
	templates : {
		group : '<div class="toolrow"></div>',
		tool : '<div class="tool"></div>',
		menutoolbar : '<div class="oskari-closed oskariui-menutoolbar"><div class="oskariui-menutoolbar-modetitle"><div class="oskariui-menutoolbar-title"><p></p></div></div><div class="oskariui-menutoolbar-container"><div class="oskariui-menutoolbarbuttongroup"></div></div><div class="oskariui-menutoolbar-closebox"><div class="icon-close-white"></div></div></div>'
	},

	/**
	 * @method init
	 * implements Module protocol init method - initializes request handlers and templates
	 */
	init : function() {
		var me = this;

		this.templateGroup = jQuery(this.templates.group);
		this.templateTool = jQuery(this.templates.tool);
		this.templateMenutoolbar = jQuery(this.templates.menutoolbar);

		this.requestHandlers = {
			toolButtonRequestHandler : Oskari.clazz.create('Oskari.mapframework.bundle.toolbar.request.ToolButtonRequestHandler', me),
			toolbarRequestHandler : Oskari.clazz.create('Oskari.mapframework.bundle.toolbar.request.ToolbarRequestHandler', me),
			showMapMeasurementRequestHandler : Oskari.clazz.create('Oskari.mapframework.bundle.toolbar.request.ShowMapMeasurementRequestHandler', me)
		};
	},
	/**
	 * @method createMenuToolbarContainer
	 *
	 */
	createMenuToolbarContainer : function(tbid, pdata) {
		var data = pdata || {};
		var tbcontainer = this.templateMenutoolbar.clone();
		this.menutoolbarcontainer.append(tbcontainer);
		this.toolbars[tbid] = tbcontainer;
		var c = tbcontainer.find(".oskariui-menutoolbarbuttongroup");
		this.containers[tbid] = c;

		if(data.title) {
			tbcontainer.find(".oskariui-menutoolbar-title p").append(data.title);
		}
		if(data.show) {
			tbcontainer.removeClass('oskari-closed');
		}
		if(data.closeBoxCallback) {
			tbcontainer.find(".oskariui-menutoolbar-closebox div").click(data.closeBoxCallback);
		}

		return c;
	},
	changeMenuToolbarTitle : function(title) {
		if(title) {
			this.menutoolbarcontainer.find(".oskariui-menutoolbar-title p").html(title);
		}
	},

	/**
	 * @method getToolbarContainer
	 * @return {jQuery} reference to the toolbar container
	 */
	getToolbarContainer : function(ptbid, data) {
		var tbid = ptbid || 'default';
		var c = this.containers[tbid];

		if(c === undefined && this.menutoolbarcontainer) {
			c = this.createMenuToolbarContainer(tbid, data);
		}

		return c;
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

			/* we'll show prompt if measure tool has been selected */
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

		sandbox.removeRequestHandler('Toolbar.ToolbarRequest', this.requestHandlers.toolbarRequestHandler);
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
	},
	
	/**
	 * @method _removeToolbar
	 * removes named toolbar
	 */
	_removeToolbar : function(tbid) {
		var tb = this.toolbars[tbid];
		this.toolbars[tbid] = undefined;
		tb.remove();
		delete tb;
	},
	
	/**
	 * @method _showToolbar
	 * shows named toolbar
	 */
	_showToolbar : function(tbid) {
		this.toolbars[tbid].show();
	},
	
	/**
	 * @method _hideToolbar
	 * 
	 * hides named toolbar
	 */
	_hideToolbar : function(tbid) {
		this.toolbars[tbid].hide();
	},
	
	/**
	 * @method _addToolbar
	 * adds named toolbar
	 */
	_addToolbar : function(tbid, data) {
		this.getToolbarContainer(tbid, data);
	}
}, {
	/**
	 * @property {String[]} protocol
	 * @static
	 */
	protocol : ['Oskari.bundle.BundleInstance', 'Oskari.mapframework.module.Module']
});
