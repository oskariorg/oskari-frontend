/**
 * @class Oskari.mapframework.bundle.statehandler.StateHandlerBundleInstance
 * Handles modules implementing Stateful protocol to get application state 
 * and uses the registered plugin to handle saving the state.
 */
Oskari.clazz.define("Oskari.mapframework.bundle.statehandler.StateHandlerBundleInstance",
/**
 * @method create called automatically on construction
 * @static
 * @param {Object} config
 * 		JSON config with params needed to run the bundle
 * 
 */
function() {
    this._localization = null;
    this._pluginInstances = {};
    this._startupState = null;
    
    this._historyPollingInterval = 1500;
    this._historyTimer = null;
    this._historyPrevious = [];
    this._historyEnabled = true;
    this._historyNext = [];

    this._currentViewId = 1;
}, {
	/**
	 * @static
	 * @property __name
	 */
	__name : 'StateHandler',
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
     * @method start
     * implements BundleInstance start methdod
     */
    "start" : function() {

		var me = this;
		if(me.started) {
			return;
		}
		me.started = true;

		var sandbox = Oskari.$("sandbox");
		me.sandbox = sandbox;
		sandbox.register(me);
		for(p in me.eventHandlers) {
			sandbox.registerForEventByName(me, p);
		}
		
        // sends a request that adds button described in config
        /*var rb = sandbox.getRequestBuilder('MapControls.ToolButtonRequest');
        if(rb) {
        	sandbox.request(this, rb(this.toolbar.config, 'add'));
        }*/

        // TODO: move to some less generic init place (application start) because
        // we only want this for mapfull?
    	var ajaxUrl = "/web/fi/kartta?p_p_id=Portti2Map_WAR_portti2mapportlet&p_p_lifecycle=1&p_p_state=exclusive&p_p_mode=view&p_p_col_id=column-1&p_p_col_count=1&_Portti2Map_WAR_portti2mapportlet_fi.mml.baseportlet.CMD=ajax.jsp&";
        var sessionPlugin = Oskari.clazz.create('Oskari.mapframework.bundle.statehandler.plugin.SaveViewPlugin', ajaxUrl);
        this.registerPlugin(sessionPlugin);
        this.startPlugin(sessionPlugin);
        
		sandbox.addRequestHandler('StateHandler.SetStateRequest', this.requestHandlers.setStateHandler);
		sandbox.addRequestHandler('StateHandler.SaveStateRequest', this.requestHandlers.saveStateHandler);

        // only use saved state if we have no controlling querystring params in
        // url (linked location etc)
        // server should return the saved session state on startup
        /*var queryStr = location.search;
        if(!queryStr) {
            this.useState(sessionPlugin.getState());
        }*/
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
	 * implements BundleInstance protocol stop method
	 */
    "stop" : function() {
		var sandbox = this.sandbox();
		sandbox.removeRequestHandler('StateHandler.SetStateRequest', this.requestHandlers.setStateHandler);
		sandbox.removeRequestHandler('StateHandler.SaveStateRequest', this.requestHandlers.saveStateHandler);
        // sends a request that removes button described in config
        var rb = sandbox.getRequestBuilder('MapControls.ToolButtonRequest');
        if(rb) {
        	sandbox.request(this, rb(this.toolbar.config, 'remove'));
        }

		for(p in this.eventHandlers) {
			sandbox.unregisterFromEventByName(this, p);
		}
		this.sandbox.unregister(this);
		this.started = false;
    },
    
	/**
	 * @method init
	 * implements Module protocol init method
	 */
	"init" : function() {
		var me = this;
        // config for toolbutton that is used to reset state to original
        this.toolbar = {
            config : {
                group : this.getName(),
                toolId : 'statehandler.reset',
                iconCls : 'statehandler_reset_tool',
                tooltip : this.getLocalization('reset'),
                callback : function() {
                    me.resetState();
                }
            }
        };
		var sandbox = Oskari.$("sandbox");
		this.requestHandlers = {
			setStateHandler : Oskari.clazz.create('Oskari.mapframework.bundle.statehandler.request.SetStateRequestHandler', sandbox, this),
			saveStateHandler : Oskari.clazz.create('Oskari.mapframework.bundle.statehandler.request.SaveStateRequestHandler', sandbox, this)
		};
        // headless
		return null;
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
        'AfterMapMoveEvent' : function(event) {
            var me = this;
            if(this._historyEnabled === true) {
                
                // we might get multiple events on one move so give a bit tolerance between moves
                if(this._historyTimer) {
                    clearTimeout(this._historyTimer);
                    this._historyTimer = null;
                }
                this._historyTimer = setTimeout(function() {
                    var mapfull = me.sandbox.getStatefulComponents()['mapfull'];
                    if(mapfull) {
                        var state = mapfull.getState();
                        //this._currentHistoryStep = state;
                        me._historyPrevious.push(state);
                    }
                }, this._historyPollingInterval);
            }
        }
	},
    historyMoveNext : function() {
        if(this._historyNext.length > 0) {
            var state = this._historyNext.pop();
            this._historyPrevious.push(state);
            var mapfull = this.sandbox.getStatefulComponents()['mapfull'];
            if(mapfull) {
                this._historyEnabled = false;
                mapfull.setState(state);
                this._historyEnabled = true;
            }
        }
    },
    historyMovePrevious : function() {
        if(this._historyPrevious.length > 0) {
            var state = this._historyPrevious.pop();
            // insert to first
            //this._historyNext.splice(0,0,state);
            this._historyNext.push(state);
            var mapfull = this.sandbox.getStatefulComponents()['mapfull'];
            if(mapfull) {
                this._historyEnabled = false;
                mapfull.setState(state);
                this._historyEnabled = true;
            }
        }
    },
	
    /**
     * @method registerPlugin
     * @param {Oskari.mapframework.bundle.statehandler.plugin.Plugin} plugin
     *    Implementation of the stateHandler plugin protocol/interface
     *
     * Registers the plugin to be used with this state handler implementation.
     */
    registerPlugin : function(plugin) {
        plugin.setHandler(this);
        var pluginName = plugin.getName();
        this.sandbox.printDebug('[' + this.getName() + ']' + ' Registering ' + pluginName);
        this._pluginInstances[pluginName] = plugin;
    },
    /**
     * @method unregisterPlugin
     * @param {Oskari.mapframework.bundle.statehandler.plugin.Plugin} plugin
     *    Implementation of the stateHandler plugin protocol/interface
     *
     * Tears down the registration of the plugin that was previously registered
     * to this state handler implementation.
     */
    unregisterPlugin : function(plugin) {
        var pluginName = plugin.getName();
        this.sandbox.printDebug('[' + this.getName() + ']' + ' Unregistering ' + pluginName);
        this._pluginInstances[pluginName] = undefined;
        plugin.setHandler(null);
    },
    /**
     * @method startPlugin
     * @param {Oskari.mapframework.bundle.statehandler.plugin.Plugin} plugin
     *    Implementation of the stateHandler plugin protocol/interface
     *
     * Starts the plugin. Calls plugins startPlugin()-method.
     */
    startPlugin : function(plugin) {
        var pluginName = plugin.getName();

        this.sandbox.printDebug('[' + this.getName() + ']' + ' Starting ' + pluginName);
        plugin.startPlugin(this.sandbox);
    },
    /**
     * @method stopPlugin
     * @param {Oskari.mapframework.bundle.statehandler.plugin.Plugin} plugin
     *    Implementation of the stateHandler plugin protocol/interface
     *
     * Stops the plugin. Calls plugins stopPlugin()-method.
     */
    stopPlugin : function(plugin) {
        var pluginName = plugin.getName();

        this.sandbox.printDebug('[' + this.getName() + ']' + ' Starting ' + pluginName);
        plugin.stopPlugin(this.sandbox);
    },

    /**
     * @method setCurrentViewId
     * @param {Number} Current view ID
     */
    setCurrentViewId : function(currentViewId) {
	this._currentViewId = currentViewId;
    },
    /**
     * @method getCurrentViewId
     * @return Current view ID
     */
    getCurrentViewId : function() {
	return this._currentViewId;
    }

}, {
    "protocol" : ["Oskari.bundle.BundleInstance", 'Oskari.mapframework.module.Module']
});
