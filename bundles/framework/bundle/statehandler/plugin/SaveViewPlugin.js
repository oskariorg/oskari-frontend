/**
 * @class Oskari.mapframework.bundle.statehandler.plugin.SaveViewPlugin
 * Provides functionality to save the current state as the users My Views.
 * Adds a button to the toolbar for saving a view.
 *
 * Also binds window.onbeforeunload to saving the state for keeping the state
 * between going to other pages in the portal.
 * The server is responsible for returning the saved state as initial state if
 * the user returns to the map.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.statehandler.plugin.SaveViewPlugin',
/**
 * @method create called automatically on construction
 * @static
 * @param {String} ajaxUrl
 * 		URL that is called to save the state
 */
function(ajaxUrl) {
	this.handler = null;
	this.pluginName = null;
	this._sandbox = null;
	this._ajaxUrl = ajaxUrl;
}, {
	/** @static @property __name plugin name */
	__name : 'statehandler.SaveViewPlugin',

	/**
	 * @method getName
	 * @return {String} plugin name
	 */
	getName : function() {
		return this.pluginName;
	},
	/**
	 * @method getHandler
	 * @return
	 * {Oskari.mapframework.bundle.ui.module.statehandler.StateHandlerModule}
	 * reference to state handler
	 */
	getHandler : function() {
		return this.handler;
	},
	/**
	 * @method setHandler
	 * @param
	 * {Oskari.mapframework.bundle.ui.module.statehandler.StateHandlerModule}
	 * reference to state handler
	 */
	setHandler : function(statehandler) {
		this.handler = statehandler;
		this.pluginName = statehandler.getName() + this.__name;
	},
	/**
	 * @method getState
	 * @return null
	 * Does nothing
	 */
	getState : function() {
	},
	/**
	 * @method resetState
	 * Does nothing
	 */
	resetState : function() {
	},
	/**
	 * @method saveState
	 * Saves current or given application state to server.
	 * @param {Object} view (name, description)
	 * @param {Object} pState view state (optional, uses
	 * handler.getCurrentState() if not given)
	 */
	saveState : function(view, pState) {

		var state = pState;
		var me = this;
		if (!state) {
			state = this.handler.getCurrentState();
		}
		var data = {
			currentViewId : me.handler.getCurrentViewId(),
			viewData : JSON.stringify(state)
		};

		if (view) {
			data.viewName = view.name;
			data.viewDescription = view.description;
		}

		var builder = me._sandbox.getEventBuilder('StateSavedEvent');
		var event = builder(data.viewName, state);
		
		//Create Cookie of map state save
		var cookieviewdata = "mymapview1=" + JSON.stringify(data);
		// toSource();
		var expiredays = 7;
		if (expiredays) {
			var exdate = new Date();
			exdate.setDate(exdate.getDate() + expiredays);
			cookieviewdata += ";expires=" + exdate.toGMTString();
		}
		document.cookie = cookieviewdata;

		// save to ajaxUrl
		jQuery.ajax({
			//dataType : "json",
			type : "POST",
			beforeSend : function(x) {
				if (x && x.overrideMimeType) {
					x.overrideMimeType("application/j-son;charset=UTF-8");
				}
			},
			url : this._ajaxUrl + 'action_route=AddView',
			data : data,
			success : function(newView) {
				me._sandbox.notifyAll(event);
				me.handler.setCurrentViewId(newView.id);
			},
			error : function() {
				// only show error if explicitly calling save

				if (viewName) {
					event.setError(true);
					me._sandbox.notifyAll(event);
				}
			}
		});
	},
	// TODO: move to some util
	serializeJSON : function(obj) {
		var me = this;
		var t = typeof (obj);
		if (t != "object" || obj === null) {
			// simple data type
			if (t == "string")
				obj = '"' + obj + '"';
			return String(obj);
		} else {
			// array or object
			var json = [], arr = (obj && obj.constructor == Array);

			jQuery.each(obj, function(k, v) {
				t = typeof (v);
				if (t == "string") {
					v = '"' + v + '"';
				} else if (t == "object" & v !== null) {
					v = me.serializeJSON(v);
				}
				json.push(( arr ? "" : '"' + k + '":') + String(v));
			});
			return ( arr ? "[" : "{") + String(json) + ( arr ? "]" : "}");
		}
	},
	/**
	 * @method startPlugin
	 *
	 * Interface method for the plugin protocol.
	 * Binds window.onbeforeunload to saving the state.
	 *
	 * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
	 * 			reference to application sandbox
	 */
	startPlugin : function(sandbox) {
		this._sandbox = sandbox;
		var me = this;
		jQuery(document).ready(function() {
			window.onbeforeunload = function() {
				// save state to session when leaving map window
				me.saveState();
				
			};
		});
	},
	/**
	 * @method stopPlugin
	 *
	 * Interface method for the plugin protocol
	 *
	 * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
	 * 			reference to application sandbox
	 */
	stopPlugin : function(sandbox) {
		this._sandbox = null;
	}
}, {
	/**
	 * @property {String[]} protocol array of superclasses as {String}
	 * @static
	 */
	'protocol' : ['Oskari.mapframework.bundle.statehandler.plugin.Plugin']
});
