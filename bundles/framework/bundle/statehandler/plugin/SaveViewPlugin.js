/**
 * @class Oskari.mapframework.bundle.statehandler.plugin.SaveViewPlugin
 * Provides functionality to save the current state as the users My Views.
 * Adds a button to the toolbar for saving a view.
 *
 * Also binds window.onbeforeunload to saving the state for keeping the state between going to other pages in the portal.
 * The server is responsible for returning the saved state as initial state if the user returns to the map.
 */
Oskari.clazz
    .define('Oskari.mapframework.bundle.statehandler.plugin.SaveViewPlugin',
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
     * Uses
     * Oskari.mapframework.bundle.ui.module
     *     .statehandler.StateHandlerModule.getCurrentState()
     * to get the current application state and saves it to a cookie.
     */
    saveState : function() {
        var state = this.handler.getCurrentState();

        var me = this;
	var loc = this.handler.getLocalization('save');

	var title = loc.title ? loc.title.save_view : 'Näkymän tallennus';
	var msg = loc.msg ? loc.msg.view_name : 'Näkymän nimi';
	var msg =
	    '<div class="e_noname" ' + 
	    'style="display: inline-block; ' + 
	    'color: red; display: none;">' + 
	    '<br />' +
	    (loc.error_noname ? 
	     loc.error_noname : 
	     "Nimi ei voi olla tyhjä!") +
	    '<br />' +
	    '</div>' + 
	    '<div class="e_illegal" ' + 
	    'style="display: inline-block; ' + 
	    'color: red; display: none;">' + 
	    '<br />' +
	    (loc.error_illegalchars ?
	     loc.error_illegalchars :
	     'Nimessä on virheellisiä merkkejä') +
	    '<br />' +
	    '</div>' +
	    msg + ": " +
	    '<input name="viewName" ' + 
	    'type="text" class="viewName" />';

	var save = {
	    name : 'button_save',
	    text : loc.button ? loc.button.save : 'Tallenna',
	    close : false,
	    onclick : function(e) {
                var viewName = 
		    jQuery('div.modalmessage input.viewName').val();
		if (viewName) {
		    if (viewName.indexOf('<') >= 0) {
			jQuery('div.modalmessage div.e_illegal').show();
		    } else {
			me._saveState(viewName);
			$.modal.close();
		    }
                } else {
                    jQuery('div.modalmessage div.e_noname').show();
                }
	    }	
	};
	var cancel = {
	    name : 'button_cancel',
	    text : loc.button ? loc.button.cancel : 'Peruuta',
	    close : true
	};

	var reqName = 'userinterface.ModalDialogRequest';
	var reqBuilder = me._sandbox.getRequestBuilder(reqName);
	var req = reqBuilder(title, msg, [ save, cancel ]);
	me._sandbox.request(me.handler, req);
    },
    /**
     * @method saveState
     * @private
     * Actual saving so we dont ask view name when exiting map
     */
    _saveState : function(viewName) {
        var state = this.handler.getCurrentState();
        var name = "";

        if(viewName) {
            name = "myViewName=" + viewName + '&';
        }
        var me = this;
        var loc = this.handler.getLocalization('save');
        // save to ajaxUrl
        jQuery.ajax({
            dataType : "json",
            type : "POST",
            beforeSend: function(x) {
              if(x && x.overrideMimeType) {
               x.overrideMimeType("application/j-son;charset=UTF-8");
              }
             },
            url : this._ajaxUrl + 'action_route=AddView',
            data : name + 
		"myViewState=" + me.serializeJSON(state) +
		"currentViewId=" + me.handler.getCurrentViewId(),
            success : function(newView) {
                alert(loc.success);
                var builder = me._sandbox.getEventBuilder('StateSavedEvent');
                var event = builder(viewName, state);
                me._sandbox.notifyAll(event);
		me.handler.setCurrentViewId(newView.id);
            },
            error : function() {
                // only show error if explicitly calling save
                if(viewName) {
                    alert(loc.error);
                    var builder = 
			me._sandbox.getEventBuilder('StateSavedEvent');
                    var event = builder(viewName, state);
                    me._sandbox.notifyAll(event);
                }
            }
        });
    },
    // TODO: move to some util
    serializeJSON : function(obj) {
        var me = this;
        var t = typeof (obj);
        if(t != "object" || obj === null) {
            // simple data type
            if(t == "string")
                obj = '"' + obj + '"';
            return String(obj);
        } else {
            // array or object
            var json = [], arr = (obj && obj.constructor == Array);

            jQuery.each(obj, function(k, v) {
                t = typeof (v);
                if(t == "string") {
                    v = '"' + v + '"';
                } else if(t == "object" & v !== null) {
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
                me._saveState();
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
    'protocol' : ['Oskari.mapframework.bundle' + '.statehandler.plugin.Plugin']
});
