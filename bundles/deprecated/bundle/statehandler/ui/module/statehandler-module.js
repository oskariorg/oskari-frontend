/**
 * @class Oskari.mapframework.bundle.statehandler.ui.module.StateHandlerModule
 * @deprecated
 *
 * Detects application state and provides JSON presentation for it.
 * Also can be used to set the application to a given state based on JSON config.
 * Saves the application state when started so it can be reseted later by calling
 * #resetState() method.
 *
 * Adds a button to map toolbar to reset state. (Button should be added by a
 * plugin?)
 * 
 * NOTE: NOT USED ANYMORE
 */
Oskari.clazz.define('Oskari.mapframework.bundle.statehandler.ui.module.StateHandlerModule',
/**
 * @method create called automatically on construction
 * @static
 * @param {Object} config
 * 		JSON config with params needed to run the plugin
 */
function(config) {
    this._sandbox = null;
    this._config = config;
    this._pluginInstances = {};
    this._originalState = {};
}, {
    /** @static @property __name module name */
    __name : "StateHandlerModule",
    /**
     * @method getName
     * @return {String} module name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method init
     *
     * Interface method for the module protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     * 			reference to application sandbox
     */
    init : function(sandbox) {
        this._sandbox = sandbox;
        var me = this;
        sandbox.printDebug("Initializing StateHandler module...");
		
		var lang = sandbox.getLanguage();
		var tooltip = 'Oletusasetusten palautus';
		if("sv" == lang) {
			tooltip = 'Återställ standardinställningarna';
		}
		else if("en" == lang) {
			tooltip = 'Restore default settings';
		}

        // config for toolbutton that initiates xml download
        this.toolbar = {
            config : {
                group : 'StateHandler',
                toolId : 'statehandlerReset',
                iconCls : 'statehandler_reset_tool',
                tooltip : tooltip,
                callback : function() {
                    me.resetState();
                }
            }
        };
        // headless
        return;
    },
    /**
     * @method useState
     * @param {Object} savedState
     * 		JSON presentation of application state, created with #getCurrentState()
     * method.
     *
     * Sends out Oskari.mapframework.request.common.RemoveMapLayerRequest,
     * Oskari.mapframework.request.common.AddMapLayerRequest,
     * Oskari.mapframework.request.common.ChangeMapLayerOpacityRequest and
     * Oskari.mapframework.request.common.MapMoveRequest to control the
     * application state
     */
    useState : function(savedState) {
        if(!savedState || !savedState.lat) {
            // dont do anything if we dont have a saved state
            return;
        }
        var selectedLayers = this._sandbox.findAllSelectedMapLayers();
        // remove all current
        var rbRemove = this._sandbox.getRequestBuilder('RemoveMapLayerRequest');
        for(var i = 0; i < selectedLayers.length; i++) {
            this._sandbox.request(this.getName(), rbRemove(selectedLayers[i].getId()));
        }
        // add layers to map
        var rbAdd = this._sandbox.getRequestBuilder('AddMapLayerRequest');
        var rbOpacity = this._sandbox.getRequestBuilder('ChangeMapLayerOpacityRequest');
        for(var i = 0; i < savedState.layers.length; i++) {
            this._sandbox.request(this.getName(), rbAdd(savedState.layers[i].id, false));
            this._sandbox.request(this.getName(), rbOpacity(savedState.layers[i].id, savedState.layers[i].opacity));
        }
        var reqMove = this._sandbox.getRequestBuilder('MapMoveRequest')(savedState.lon, savedState.lat, savedState.zoom, false);
        this._sandbox.request(this.getName(), reqMove);
    },
    /**
     * @method resetState
     * Used to return the application to its original state.
     * Calls resetState-methods for all plugins and returns the application state
     * by
     * calling #useState with config gathered/saved on bundle start.
     *
     * All plugins should handle themselves what this means in the plugins
     * implementation.
     */
    resetState : function() {
        for(var pluginName in this._pluginInstances) {
            this._sandbox.printDebug('[' + this.getName() + ']' + ' resetting state on ' + pluginName);
            this._pluginInstances[pluginName].resetState();
        }
        // reinit with startup params
        this.useState(this._originalState);
    },
    /**
     * @method saveState
     * @param {String} pluginName (optional)
     * 	Calls the saveState method of the given plugin or if not given, calls it
     * for each plugin
     *
     * Used to store the application state though the module/bundle does nothing
     * itself.
     * All actual implementations are done in plugins.
     */
    saveState : function(pluginName) {
        if(!pluginName) {
            for(var pluginName in this._pluginInstances) {
                this.saveState(pluginName);
            }
            return;
        }
        this._sandbox.printDebug('[' + this.getName() + ']' + ' saving state with ' + pluginName);
        this._pluginInstances[pluginName].saveState();
    },
    /**
     * @method getCurrentState
     * @return {Object} JSON object presenting the state of the application at
     * the moment.
     */
    getCurrentState : function() {
        // get applications current state
        var map = this._sandbox.getMap();
        var selectedLayers = this._sandbox.findAllSelectedMapLayers();
        var zoom = map.getZoom();
        var lat = map.getX();
        var lon = map.getY();

        var state = {
            lat : map.getY(),
            lon : map.getX(),
            zoom : map.getZoom(),
            layers : []
        };

        for(var i = 0; i < selectedLayers.length; i++) {
            var layer = selectedLayers[i];
            state.layers.push({
                id : layer.getId(),
                opacity : layer.getOpacity()
            });
        }
        return state;
    },
    /**
     * @method getSavedState
     * @param {String} pluginName
     * Calls the plugins getState()-method.
     * It should return a JSON object created by #getCurrentState on earlier
     * time.
     */
    getSavedState : function(pluginName) {
        return this._pluginInstances[pluginName].getState();
    },
    /**
     * @method start
     *
     * Interface method for the module protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     * 			reference to application sandbox
     */
    start : function(sandbox) {
        sandbox.printDebug("Starting " + this.getName());

        // register for listening events
        for(var p in this.eventHandlers ) {
            sandbox.registerForEventByName(this, p);
        }

        // sends a request that adds button described in config
        sandbox.request(this, sandbox.getRequestBuilder('MapControls.ToolButtonRequest')(this.toolbar.config, 'add'));

        // save original state for resetting
        this._originalState = this.getCurrentState();

        // TODO: move to some less generic init place (application start) because
        // we only want this for mapfull?
        var sessionPlugin = Oskari.clazz.create('Oskari.mapframework.bundle.statehandler.plugin.SessionStatePlugin');
        this.registerPlugin(sessionPlugin);
        this.startPlugin(sessionPlugin);

        // only use saved state if we have no controlling querystring params in
        // url (linked location etc)
        var queryStr = location.search;
        if(!queryStr) {
            this.useState(sessionPlugin.getState());
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
        var sandbox = this._sandbox;
        plugin.setHandler(this);
        var pluginName = plugin.getName();
        sandbox.printDebug('[' + this.getName() + ']' + ' Registering ' + pluginName);
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
        var sandbox = this._sandbox;
        var pluginName = plugin.getName();
        sandbox.printDebug('[' + this.getName() + ']' + ' Unregistering ' + pluginName);
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
        var sandbox = this._sandbox;
        var pluginName = plugin.getName();

        sandbox.printDebug('[' + this.getName() + ']' + ' Starting ' + pluginName);
        plugin.startPlugin(sandbox);
    },
    /**
     * @method stopPlugin
     * @param {Oskari.mapframework.bundle.statehandler.plugin.Plugin} plugin
     *    Implementation of the stateHandler plugin protocol/interface
     *
     * Stops the plugin. Calls plugins stopPlugin()-method.
     */
    stopPlugin : function(plugin) {
        var sandbox = this._sandbox;
        var pluginName = plugin.getName();

        sandbox.printDebug('[' + this.getName() + ']' + ' Starting ' + pluginName);
        plugin.stopPlugin(sandbox);
    },
    /**
     * @method stop
     *
     * Interface method for the module protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     * 			reference to application sandbox
     */
    stop : function(sandbox) {
        // sends a request that removes button described in config
        sandbox.request(this, sandbox.getRequestBuilder('MapControls.ToolButtonRequest')(this.toolbar.config, 'remove'));

        for(p in this.eventHandlers ) {
            sandbox.unregisterFromEventByName(this, p);
        }

    },
    /**
     * @property {Object} eventHandlers
     * @static
     */
    eventHandlers : {
    	/*
     	'AfterMapLayerRemoveEvent' : function(event) {
     		// not used
     	}*/
     },
     
    /**
     * @method onEvent
     * @param {Oskari.mapframework.event.Event} event a Oskari event object
     * Event is handled forwarded to correct #eventHandlers if found or discarded
     * if not.
     */
    onEvent : function(event) {
        var handler = this.eventHandlers[event.getName()];
        if(!handler) {
            return;
        }
        return handler.apply(this, [event]);
    }

}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.module.Module']
});

/* Inheritance */