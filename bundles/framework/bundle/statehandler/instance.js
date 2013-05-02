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
    this._historyNext = [];
    this._historyEnabled = true;

	// TODO: default view from conf?
    this._defaultViewId = 1;
    this._currentViewId = this._defaultViewId;
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
        if (me.started) {
            return;
        }
        me.started = true;

   		var conf = this.conf ;
		var sandboxName = ( conf ? conf.sandbox : null ) || 'sandbox' ;
		var sandbox = Oskari.getSandbox(sandboxName);

        me.sandbox = sandbox;
        sandbox.register(me);
        for (p in me.eventHandlers) {
            sandbox.registerForEventByName(me, p);
        }

        var ajaxUrl = sandbox.getAjaxUrl(); 
        //"/web/fi/kartta?p_p_id=Portti2Map_WAR_portti2mapportlet&p_p_lifecycle=1&p_p_state=exclusive&p_p_mode=view&p_p_col_id=column-1&p_p_col_count=1&_Portti2Map_WAR_portti2mapportlet_fi.mml.baseportlet.CMD=ajax.jsp&";
        var sessionPlugin = Oskari.clazz.create('Oskari.mapframework.bundle.statehandler.plugin.SaveViewPlugin', ajaxUrl);
        this.registerPlugin(sessionPlugin);
        this.startPlugin(sessionPlugin);

        sandbox.addRequestHandler('StateHandler.SetStateRequest', this.requestHandlers.setStateHandler);
        sandbox.addRequestHandler('StateHandler.SaveStateRequest', this.requestHandlers.saveStateHandler);
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
        if (rb) {
            sandbox.request(this, rb(this.toolbar.config, 'remove'));
        }

        for (p in this.eventHandlers) {
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
        var sandbox = this.sandbox;
        this.requestHandlers = {
            setStateHandler : Oskari.clazz.create('Oskari.mapframework.bundle.statehandler.request.SetStateRequestHandler', sandbox, this),
            saveStateHandler : Oskari.clazz.create('Oskari.mapframework.bundle.statehandler.request.SaveStateRequestHandler', sandbox, this)
        };
        // headless
        return null;
    },
    /**
     * @method getLocalization
     * Returns JSON presentation of bundles localization data for current
     * language.
     * If key-parameter is not given, returns the whole localization data.
     *
     * @param {String} key (optional) if given, returns the value for key
     * @return {String/Object} returns single localization string or
     * 		JSON object for complete data depending on localization
     * 		structure and if parameter key is given
     */
    getLocalization : function(key) {
        if (!this._localization) {
            this._localization = Oskari.getLocalization(this.getName());
        }
        if (key) {
            return this._localization[key];
        }
        return this._localization;
    },

    /**
     * @method onEvent
     * @param {Oskari.mapframework.event.Event} event a Oskari event object
     * Event is handled forwarded to correct #eventHandlers if found or discarded
     * if not.
     */
    onEvent : function(event) {
        var handler = this.eventHandlers[event.getName()];
        if (!handler)
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
           me._pushState();
        },
        'AfterMapLayerAddEvent' : function(event) {
           var me = this;
           me._pushState();
        },
        'AfterMapLayerRemoveEvent' : function(event) {
           var me = this;
           me._pushState();
        },
        'AfterChangeMapLayerStyleEvent': function(event) {
           var me = this;
           me._pushState();
        },
        'MapLayerVisibilityChangedEvent' : function(event) {
           var me = this;
           me._pushState();
        	
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
    },

	/* state pop / push ie undo redo begins here */
    
    _stateComparators: [
     	{ 
     		rule: 'nohistory',
     		cmp: function(prevState,nextState) {
    			if( !prevState ) {
    				return true;
	    		}
    		}
    	},{
    		rule: 'location',
    		cmp: function(prevState,nextState) {
    			if( prevState.east != nextState.east ||
    			prevState.north != nextState.north 
    				) {
    				return true;
    			}	
	    		if( prevState.zoom != nextState.zoom ) {
    				return true;
    			}
    		}
    	},{
    		rule: 'layers',
    		cmp: function(prevState,nextState) {
    			var me = this;
    			var prevLayers = prevState.selectedLayers;
    			var nextLayers = nextState.selectedLayers;
    			
	    		if( prevLayers.length != nextLayers.length ) {
    				return true;
    			}
    			for( var ln = 0 ; ln < nextLayers.length;ln++ ) {
    				var prevLayer = prevLayers[ln];
    				var nextLayer = nextLayers[ln];
    				
    				me.sandbox.printDebug("[StateHandler] comparing layer state "+prevLayer.id +" vs "+nextLayer.id);
    				
    				
	    			if( prevLayer.id !== nextLayer.id ) {
    					return true;
    				}
    				if( prevLayer.opacity !== nextLayer.opacity ) {
	    				return true;
    				}
    				if( prevLayer.hidden !== nextLayer.hidden ) {
    					return true;
    				}
    				if( prevLayer.style !== nextLayer.style ) {
    					return true;
    				}
    			}
    			
    			return false;
    		}
    	}
    ],
    
    _compareState: function(prevState,nextState,returnFirst) {
    	var cmpResult = { result: false, rule: null, rulesMatched: {} };
    	
    	var me = this;
    	for( var sc = 0 ; sc < me._stateComparators.length ; sc++ ) {
    		var cmp = me._stateComparators[sc];
    		me.sandbox.printDebug("[StateHandler] comparing state "+cmp.rule);
    		if( cmp.cmp.apply(this,[prevState,nextState])) {
    			me.sandbox.printDebug("[StateHandler] comparing state MATCH "+cmp.rule);
    			cmpResult.result = true;
    			cmpResult.rule = cmp.rule;
    			cmpResult.rulesMatched[cmp.rule] = cmp.rule;
    			if( returnFirst ) {
    				return cmpResult;
    			}
    		}
    	}
    	return cmpResult;
    },

    /**
     * @method logState
     * @private
     * Sends a GET request to the url in the conf with map parameters
     */
    _logState: function() {
        var me = this,
            logUrlWithLinkParams = me.conf.logUrl + '?'+ me.sandbox.generateMapLinkParameters();

        jQuery.ajax({
            type : "GET",
            url : logUrlWithLinkParams
        });
    },
    
	_pushState: function() {
		var me = this;
		if (me._historyEnabled ) {
			var history = me._historyPrevious;

			var state = this._getMapState();

			var prevState = history.length == 0 ? null : history[history.length-1];
			var cmpResult = me._compareState( prevState, state, true );
			if( cmpResult.result ) {
				me.sandbox.printDebug("[StateHandler] PUSHING state");
				state.rule = cmpResult.rule;
				me._historyPrevious.push(state);
				me._historyNext = [];
				
				if (me.conf && me.conf.logUrl) {
					me._logState();
				} 
			}
		}
	},
       
	historyMoveNext : function() {
		var sandbox = this.getSandbox();
		if (this._historyNext.length > 0) {
			var state = this._historyNext.pop();
			this._historyPrevious.push(state);

			var mapmodule = sandbox.findRegisteredModuleInstance('MainMapModule');
			this._historyEnabled = false;                

			var currentState = this._getMapState();
			this._setMapState(mapmodule,state,currentState);
			this._historyEnabled = true;
		}
	},
    
	historyMovePrevious : function() {
		var sandbox = this.getSandbox();
		switch(this._historyPrevious.length) {
			case 0:
				/* hard reset */
				/*this.resetState();*/
				break;
			case 1:
				/* soft reset (retains the future) */
				var nextHistory = this._historyNext;
				this.resetState();
				this._historyNext = nextHistory; 
				break;    	
			default:
				/* pops current state */
				var cstate = this._historyPrevious.pop(); /* currentstate */
				this._historyNext.push(cstate);
				var state = this._historyPrevious[this._historyPrevious.length-1];            
				var mapmodule = sandbox.findRegisteredModuleInstance('MainMapModule');
				var currentState = this._getMapState();
				this._historyEnabled = false;
				this._setMapState(mapmodule,state,currentState);
				this._historyEnabled = true;            
				break;
		}
	},
    
    /**
	 * @method getMapState
	 * Returns bundle state as JSON
	 * @return {Object} 
	 */
	_getMapState : function() {
        // get applications current state
        var sandbox = this.getSandbox();
        var map = sandbox.getMap();
        var selectedLayers = sandbox.findAllSelectedMapLayers();
        var zoom = map.getZoom();
        var lat = map.getX();
        var lon = map.getY();

        var state = {
            north : lon,
            east : lat,
            zoom : map.getZoom(),
            selectedLayers : []
        };
        
        for(var i = 0; i < selectedLayers.length; i++) {
            var layer = selectedLayers[i];
            var layerJson = {
                id : layer.getId(),
                opacity : layer.getOpacity()
            };
            if(!layer.isVisible()) {
                layerJson.hidden = true;
            }
            // check if we have a style selected and doesn't have THE magic string
            if(layer.getCurrentStyle && 
                layer.getCurrentStyle() && 
                layer.getCurrentStyle().getName() &&
                layer.getCurrentStyle().getName() != "!default!") {
                layerJson.style = layer.getCurrentStyle().getName();
            }
            state.selectedLayers.push(layerJson);
        }
		
		return state;
	},
    
    _setMapState: function(mapmodule,state,currentState) {  
    	var sandbox = this.getSandbox();
        
        var cmpResult = this._compareState(currentState,state,false);
     
        // setting state
        if(state.selectedLayers && cmpResult.rulesMatched['layers'] ) {
        	sandbox.printDebug("[StateHandler] restoring LAYER state");        	
        	this._teardownState(mapmodule);
	        
            var rbAdd = sandbox.getRequestBuilder('AddMapLayerRequest');
            var rbOpacity = sandbox.getRequestBuilder('ChangeMapLayerOpacityRequest');
            var visibilityRequestBuilder = sandbox.getRequestBuilder('MapModulePlugin.MapLayerVisibilityRequest');
            var styleReqBuilder = sandbox.getRequestBuilder('ChangeMapLayerStyleRequest');
            var len = state.selectedLayers.length;
            for(var i = 0; i < len; ++i ) {
                var layer = state.selectedLayers[i];
                sandbox.request(mapmodule.getName(), rbAdd(layer.id, true));
                if(layer.hidden) {
                    sandbox.request(mapmodule.getName(), visibilityRequestBuilder(layer.id, false));
                } else {
                	sandbox.request(mapmodule.getName(), visibilityRequestBuilder(layer.id, true));
                }
                if(layer.style) {
                    sandbox.request(mapmodule.getName(), styleReqBuilder(layer.id, layer.style));
                }
                if(layer.opacity) {
                    sandbox.request(mapmodule.getName(), rbOpacity(layer.id, layer.opacity));
                }
            }
        }

        if(state.east) {
        	sandbox.printDebug("[StateHandler] restoring LOCATION state");
            this.getSandbox().getMap().moveTo( 
                state.east,
                state.north,
                state.zoom);
        }

        // FIXME: this is what start-map-with -enhancements should be doing, they are just doing it in wrong place
        sandbox.syncMapState(true);
    },
    /**
     * @method _teardownState
     * Tears down previous state so we can set a new one.
     * @private
     * @param {Oskari.mapframework.module.Module} module 
     *      any registered module so we can just send out requests
     */
    _teardownState : function(module) {
    	var sandbox = this.getSandbox();
        var selectedLayers = sandbox.findAllSelectedMapLayers();
        // remove all current layers
        var rbRemove = sandbox.getRequestBuilder('RemoveMapLayerRequest');
        for(var i = 0; i < selectedLayers.length; i++) {
            sandbox.request(module.getName(), rbRemove(selectedLayers[i].getId()));
        }
    }
    
}, {
    "protocol" : ["Oskari.bundle.BundleInstance", 'Oskari.mapframework.module.Module']
});
