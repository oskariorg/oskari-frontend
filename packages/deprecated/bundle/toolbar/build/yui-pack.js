/* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 12:23:19 GMT+0300 (Suomen kesäaika)) */ 
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
			toolButtonRequestHandler : Oskari.clazz.create('Oskari.mapframework.bundle.toolbar.request.ToolButtonRequestHandler', me)
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
    /**
     * @property {Object} eventHandlers
     * @static
     */
	eventHandlers : {
	    /*
         * @method ToolSelectedEvent
         * Some tool selected in Oskari, reset to default tool
        'ToolSelectedEvent' : function(event) {
        }
            */
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
        this.sandbox.unregisterStateful(this.mediator.bundleId);
		me.sandbox.unregister(me);
		me.started = false;
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
            
            var groupContainer = toolbar.find('div.toolrow[tbgroup=' + group +']');
            if(groupContainer.length > 0) {
                var button = groupContainer.find('div.tool[tool=' + tool +']');
                if(button.length > 0) {
                    // select the new one
                    button.addClass('selected');
                    // "click" the button
                    this.buttons[group][tool].callback();
                }
                // if button has not yet been added 
                // we should obey the state in add button
            }
        }
        else {
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
Oskari.clazz.category('Oskari.mapframework.bundle.toolbar.ToolbarBundleInstance', 'button-methods', {
	
    /**
     * @method addToolButton
     * 
     * @param {String}
     *            pId identifier so we can manage the button with subsequent requests
     * @param {String}
     *            pGroup identifier for organizing buttons
     * @param {Object} pConfig
     *            JSON config for button
     *
     * Adds a button to the toolbar. Triggered usually by sending 
     * Oskari.mapframework.bundle.toolbar.request.AddToolButtonRequest.
     */
    addToolButton : function(pId, pGroup, pConfig) {
        if(!pId || !pGroup || !pConfig || !pConfig.callback) {
            // no config -> do nothing
            return;
        }
        var me = this;
        var toolbar = this.getToolbarContainer();
        var group = null;
        if(!this.buttons[pGroup]) {
            // create group if not existing
            this.buttons[pGroup] = {};
            group = this.templateGroup.clone();
            group.attr('tbgroup', pGroup);
            toolbar.append(group);
        }
        else {
            group = toolbar.find('div.toolrow[tbgroup=' + pGroup +']');
        }
        
        if(this.buttons[pGroup][pId]) {
            // button already added, dont add again
            return;
        }
        
        // create button to requested group with requested id
        this.buttons[pGroup][pId] = pConfig;
        var button = this.templateTool.clone();
        button.attr('tool', pId);
        button.attr('title', pConfig['tooltip']);
        button.addClass(pConfig['iconCls']);
        
        // handling for state setting if the button was not yet on toolbar on setState
        if(this.selectedButton) {
            if(this.selectedButton.id == pId &&
               this.selectedButton.group == pGroup) {
                    button.addClass('selected');
                    pConfig['callback']();
               }
        }
        else {
            if(pConfig['selected']) {
                button.addClass('selected');
                me.selectedButton = {
                    id : pId,
                    group : pGroup
                };
            }
        }
        button.bind('click', function(event) {
            if(me.buttons[pGroup][pId].enabled == false) {
                return;
            }
            if(pConfig['sticky'] == true) {
                me._removeToolSelections();
                button.addClass('selected');
                me.selectedButton = {
                    id : pId,
                    group : pGroup
                };
            }
            pConfig['callback']();
        });
        group.append(button);
    },
    /**
     * @method _removeToolSelections
     * @private
     * Clears selection from all tools to make room for a new selection
     */
    _removeToolSelections : function() {
        var toolbar = this.getToolbarContainer();
        var tools = toolbar.find('div.tool');
        tools.removeClass('selected');
    },
    /**
     * @method removeToolButton
     * 
     * @param {String}
     *            pId identifier for a button (optional)
     * @param {String}
     *            pGroup identifier for group of buttons
     *
     * Removes a button from the toolbar all whole group of buttons if pId is not defined. 
     * Triggered usually by sending Oskari.mapframework.bundle.toolbar.request.RemoveToolButtonRequest.
     */
    removeToolButton : function(pId, pGroup) {
        if(!pGroup) {
            return;
        }
        if(this.buttons[pGroup]) {
            var toolbar = this.getToolbarContainer();
            var group = toolbar.find('div.toolrow[tbgroup=' + pGroup +']');
            if(pId) {
                var button = group.find('div.tool[tool=' + pId +']');
                button.remove();
                this.buttons[pGroup][pId] = null;
                delete this.buttons[pGroup][pId];
                // TODO: check if no buttons left -> delete group also?
            }
            else {
                // delete whole group
                group.remove();
                this.buttons[pGroup] = null;
                delete this.buttons[pGroup];
            }
        }
    },
    /**
     * @method changeToolButtonState
     * 
     * @param {String}
     *            pId identifier for a button (optional)
     * @param {String}
     *            pGroup identifier for group of buttons
     * @param {Boolean}
     *            pState  true if enabled, false to disable
     *
     * Enables/disables a button from the toolbar all whole group of buttons if pId is not defined. 
     * Triggered usually by sending Oskari.mapframework.bundle.toolbar.request.ToolButtonStateRequest.
     */
    changeToolButtonState : function(pId, pGroup, pState) {
        if(!pGroup) {
            return;
        }
        if(this.buttons[pGroup]) {
            var toolbar = this.getToolbarContainer();
            var group = toolbar.find('div.toolrow[tbgroup=' + pGroup +']');
            if(pId) {
                var button = group.find('div.tool[tool=' + pId +']');
                this.buttons[pGroup][pId].enabled = pState;
                if(pState) {
                    button.removeClass('disabled');
                }
                else {
                    button.addClass('disabled');
                }
            }
            else {
                var buttonContainers = group.find('div.tool');
                if(pState) {
                    buttonContainers.removeClass('disabled');
                }
                else {
                    buttonContainers.addClass('disabled');
                }
                for(var b in this.buttons[pGroup]) {
                    this.buttons[pGroup][b].enabled = pState; 
                }
            }
        }
    }
});

	Oskari.clazz.category('Oskari.mapframework.bundle.toolbar.ToolbarBundleInstance', 'default-buttons', {
    
	/**
	 * @method _addDefaultButtons
	 * @private
	 * 
	 * Adds default map window controls to toolbar.
	 * TODO: check if we really want to do this here instead of mapfull start()
	 */
	_addDefaultButtons : function() {
	    var me = this;
        var reqBuilder = this.getSandbox().getRequestBuilder('ToolSelectionRequest');
        
        /* basic tools */
        this.addToolButton('reset', 'history', {
            iconCls : 'tool-reset',
            tooltip: 'Paluu aloitusnäkymään',
            sticky: false,
            callback : function() {                
                // statehandler reset state
                var rb = me.getSandbox().getRequestBuilder('StateHandler.SetStateRequest');
                if(rb) {
                    me.getSandbox().request(me, rb());
                }
                // clear history
                var req = me.getSandbox().getRequestBuilder('ClearHistoryRequest')();
                me.getSandbox().request(me, req);
            }
        });
        this.addToolButton('history_back', 'history', {
            iconCls : 'tool-history-back',
            tooltip: 'Taaksepäin historiassa',
            sticky: false,
            callback : function() {
                me.getSandbox().request(me, reqBuilder('map_control_tool_prev'));
            }
        });
        this.addToolButton('history_forward', 'history', {
            iconCls : 'tool-history-forward',
            tooltip: 'Eteenpäin historiassa',
            sticky: false,
            callback : function() {
                me.getSandbox().request(me, reqBuilder('map_control_tool_next'));
            }
        });
        
        /* basic tools */
        this.addToolButton('zoombox', 'basictools', {
            iconCls : 'tool-zoombox',
            tooltip: 'Zoom',
            sticky: true,
            callback : function() {
                me.getSandbox().request(me, reqBuilder('map_control_zoom_tool'));
            }
        });
        this.addToolButton('select', 'basictools', {
            iconCls : 'tool-pan',
            tooltip: 'Pan',
            selected : true,
            sticky: true,
            callback : function() {
                me.getSandbox().request(me, reqBuilder('map_control_navigate_tool'));
            }
        });
        
        /* Measurements area */
        this.addToolButton('measureline', 'measuretools', {
            iconCls : 'tool-measure-line',
            tooltip: 'Measure line',
            sticky: true,
            callback : function() {
                me.getSandbox().request(me, reqBuilder('map_control_measure_tool'));
            }
        });
        
        this.addToolButton('measurearea', 'measuretools', {
            iconCls : 'tool-measure-area',
            tooltip: 'Measure area',
            sticky: true,
            callback : function() {
                me.getSandbox().request(me, reqBuilder('map_control_measure_area_tool'));
            }
        });
	}
    
});

	/**
 * @class Oskari.mapframework.bundle.toolbar.request.AddToolButtonRequest
 * Requests for toolbar to add button with given config
 * 
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.toolbar.request.AddToolButtonRequest', 
/**
 * @method create called automatically on construction
 * @static
 *
 * @param {String}
 *            id identifier so we can manage the button with subsequent requests
 * @param {String}
 *            group identifier for organizing buttons
 * @param {Object} config
 *            JSON config for button
 */
function(id, group, config) {
    this._id = id;
    this._group = group;
    this._config = config;
}, {
    /** @static @property __name request name */
    __name : "Toolbar.AddToolButtonRequest",
    /**
     * @method getName
     * @return {String} request name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getId
     * @return {String} identifier so we can manage the button with subsequent requests
     */
    getId : function() {
        return this._id;
    },
    /**
     * @method getGroup
     * @return {String} identifier for organizing buttons
     */
    getGroup : function() {
        return this._group;
    },
    /**
     * @method getConfig
     * @return {Object} button config
     */
    getConfig : function() {
        return this._config;
    }
}, {
    'protocol' : ['Oskari.mapframework.request.Request']
});/**
 * @class Oskari.mapframework.bundle.toolbar.request.RemoveToolButtonRequest
 * Requests for toolbar to remove button with given id/group
 * 
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.toolbar.request.RemoveToolButtonRequest', 
/**
 * @method create called automatically on construction
 * @static
 *
 * @param {String}
 *            id identifier so we can manage the button with subsequent requests
 * @param {String}
 *            group identifier for organizing buttons
 */
function(id, group) {
    this._id = id;
    this._group = group;
}, {
    /** @static @property __name request name */
    __name : "Toolbar.RemoveToolButtonRequest",
    /**
     * @method getName
     * @return {String} request name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getId
     * @return {String} identifier so we can manage the button with subsequent requests
     */
    getId : function() {
        return this._id;
    },
    /**
     * @method getGroup
     * @return {String} identifier for organizing buttons
     */
    getGroup : function() {
        return this._group;
    }
}, {
    'protocol' : ['Oskari.mapframework.request.Request']
});/**
 * @class Oskari.mapframework.bundle.toolbar.request.ToolButtonStateRequest
 * Requests for toolbar to enable/disable a button.
 * 
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.toolbar.request.ToolButtonStateRequest', 
/**
 * @method create called automatically on construction
 * @static
 *
 * @param {String}
 *            id identifier so we can manage the button with subsequent requests
 * @param {String}
 *            group identifier for organizing buttons
 * @param {Boolean}
 *            state true if enabled, false to disable
 */
function(id, group, state) {
    this._id = id;
    this._group = group;
    this._state = (state == true);
}, {
    /** @static @property __name request name */
    __name : "Toolbar.ToolButtonStateRequest",
    /**
     * @method getName
     * @return {String} request name
     */
    getName : function() {
        return this.__name;
    },

    /**
     * @method getId
     * @return {String} identifier so we can manage the button with subsequent requests
     */
    getId : function() {
        return this._id;
    },
    /**
     * @method getGroup
     * @return {String} identifier for organizing buttons
     */
    getGroup : function() {
        return this._group;
    },
    /**
     * @method getState
     * @return {Boolean} true to enable, false to disable
     */
    getState : function() {
        return this._state;
    }
}, {
    'protocol' : ['Oskari.mapframework.request.Request']
});

/* Inheritance *//**
 * @class Oskari.mapframework.bundle.toolbar.request.ToolButtonRequestHandler
 * Handles Oskari.mapframework.bundle.toolbar.request.AddToolButtonRequest,
 * Oskari.mapframework.bundle.toolbar.request.RemoveToolButtonRequest and
 * Oskari.mapframework.bundle.toolbar.request.ToolButtonStateRequest
 *  for managing toolbar buttons
 */
Oskari.clazz.define('Oskari.mapframework.bundle.toolbar.request.ToolButtonRequestHandler', 

/**
 * @method create called automatically on construction
 * @static
 * @param {Oskari.mapframework.bundle.toolbar.ToolbarBundleInstance} toolbar
 *          reference to toolbarInstance that handles the buttons
 */
function(toolbar) {
    this._toolbar = toolbar;
}, {
    /**
     * @method handleRequest 
     * Hides the requested infobox/popup
     * @param {Oskari.mapframework.core.Core} core
     *      reference to the application core (reference sandbox core.getSandbox())
     * @param {Oskari.mapframework.bundle.toolbar.request.AddToolButtonRequest/Oskari.mapframework.bundle.toolbar.request.RemoveToolButtonRequest/Oskari.mapframework.bundle.toolbar.request.ToolButtonStateRequest} request
     *      request to handle
     */
    handleRequest : function(core, request) {
        var sandbox = core.getSandbox();
        if(request.getName() == 'Toolbar.AddToolButtonRequest') {
            this._handleAdd(sandbox, request);
        }
        else if(request.getName() == 'Toolbar.RemoveToolButtonRequest') {
            this._handleRemove(sandbox, request);
        }
        else if(request.getName() == 'Toolbar.ToolButtonStateRequest') {
            this._handleState(sandbox, request);
        }
    },
    _handleAdd : function(sandbox, request) {
        this._toolbar.addToolButton(
            request.getId(), request.getGroup(), request.getConfig());
    },
    _handleRemove : function(sandbox, request) {
        this._toolbar.removeToolButton(
            request.getId(), request.getGroup());
    },
    _handleState : function(sandbox, request) {
        this._toolbar.changeToolButtonState(
            request.getId(), request.getGroup(), request.getState());
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    protocol : ['Oskari.mapframework.core.RequestHandler']
});
