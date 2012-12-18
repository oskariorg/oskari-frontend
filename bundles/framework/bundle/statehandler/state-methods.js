Oskari.clazz.category('Oskari.mapframework.bundle.statehandler.StateHandlerBundleInstance', 'state-methods', {
	
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
    useState : function(state) {
        if(!state) {
            // dont do anything if we dont have a saved state
            return [];
        }
        var components = this.sandbox.getStatefulComponents();
        var loopedComponents = [];
        for(var id in state) {
            if(components[id]) {
                // safety check that we have the component in current config
                components[id].setState(state[id].state);
            }
            loopedComponents.push(id);
        }
        return loopedComponents;
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
    	var me = this;
    	me._historyEnabled = false;
        me._historyPrevious = [];
	    me._historyNext = [];

    	
        for(var pluginName in this._pluginInstances) {
            me.sandbox.printDebug('[' + me.getName() + ']' + ' resetting state on ' + pluginName);
            me._pluginInstances[pluginName].resetState();
        }
        // reinit with startup params
     
		// get initial state from server
    	me._currentViewId = this._defaultViewId;
		if(me._startupState) {
            me._resetComponentsWithNoStateData(me.useState(this._startupState));
		}
		else {
            jQuery.ajax({
                dataType : "json",
                type : "GET",
                // noSavedState=true parameter tells we dont want the state saved in session
                url : me.sandbox.getAjaxUrl() + 'action_route=GetMapConfiguration&noSavedState=true',
                success : function(data) {
                    me._startupState = data;
                    me._resetComponentsWithNoStateData(me.useState(data));
                    me._historyEnabled = true;
                },
                error : function() {
                    alert('error loading conf');
                    me._historyEnabled = true;
                },
                complete: function() {
                	me._historyEnabled = true;
                }
            });
		}
        
        me._historyEnabled = true;
    },
    /**
     * @method _resetComponentsWithNoStateData
     * Used to return the application to its original state. 
     * Loops through all the stateful components and calls their setState()
     * with no parameters to reset them. Ignores the components whose IDs are listed in 
     * the parameter array.
     * @param {String[]}  loopedComponents 
     *      list of component IDs that had state data and should not be resetted
     *
     */
    _resetComponentsWithNoStateData : function(loopedComponents) {
        // loop all stateful components and reset their state they are not in loopedComponents
        var components = this.sandbox.getStatefulComponents();
        for(var cid in components) {
            var found = false;
            for(var i = 0; i < loopedComponents.length; ++i) {
                if(cid == loopedComponents[i]) {
                    found = true;
                    break;
                }
            }
            if(!found)  {
                // set empty state for resetting state
                components[cid].setState();
            }
        }
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
    saveState : function(viewName, pluginName) {
        if(!pluginName) {
            for(var pluginName in this._pluginInstances) {
                this.saveState(viewName, pluginName);
            }
            return;
        }
        this.sandbox.printDebug('[' + this.getName() + ']' + ' saving state with ' + pluginName);
        this._pluginInstances[pluginName].saveState(viewName);
    },
    /**
     * @method getCurrentState
     * @return {Object} JSON object presenting the state of the application at
     * the moment.
     */
    getCurrentState : function() {
        var state = {};
    	var components = this.sandbox.getStatefulComponents();
    	for(var id in components) {
    	    state[id] = {
    	        // wrap with additional state property so we can use the same json as in startup configuration
    	        'state' : components[id].getState()
    	    };
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
    }
    
   
});

	