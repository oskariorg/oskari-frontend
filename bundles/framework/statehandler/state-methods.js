Oskari.clazz.category('Oskari.mapframework.bundle.statehandler.StateHandlerBundleInstance', 'state-methods', {

    /**
     * @method useState
     * @param {Object} savedState
     *      JSON presentation of application state, created with #getCurrentState()
     * method.
     *
     * Sends out Oskari.mapframework.request.common.RemoveMapLayerRequest,
     * Oskari.mapframework.request.common.AddMapLayerRequest,
     * Oskari.mapframework.request.common.ChangeMapLayerOpacityRequest and
     * Oskari.mapframework.request.common.MapMoveRequest to control the
     * application state
     */
    useState: function (state) {
        if (!state) {
            // dont do anything if we dont have a saved state
            return [];
        }
        this.sandbox.useState(state);
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
    resetState: function () {
        var me = this,
            pluginName,
            startupState;
        me._historyEnabled = false;
        me._historyPrevious = [];
        me._historyNext = [];


        for (pluginName in me._pluginInstances) {
            if (me._pluginInstances.hasOwnProperty(pluginName)) {
                me.sandbox.printDebug('[' + me.getName() + ']' + ' resetting state on ' + pluginName);
                me._pluginInstances[pluginName].resetState();
            }
        }
        // reinit with startup params

        // get initial state from server
        me._currentViewId = me._defaultViewId;
        startupState = me._getStartupState();
        var log = Oskari.log('Oskari.mapframework.bundle.statehandler.StateHandlerBundleInstance');

        if (startupState) {
            me.useState(startupState);
        } else {
            jQuery.ajax({
                dataType: "json",
                type: "GET",
                // noSavedState=true parameter tells we dont want the state saved in session
                url: me.sandbox.getAjaxUrl() + 'action_route=GetAppSetup&noSavedState=true',
                success: function (data) {
                    if (data && data.configuration) {
                        me._setStartupState(data.configuration);
                        me.useState(me._getStartupState());
                        me._historyEnabled = true;
                    } else {
                        log.warn('error in getting configuration');
                    }
                },
                error: function () {
                    log.warn('error loading conf');
                    me._historyEnabled = true;
                },
                complete: function () {
                    me._historyEnabled = true;
                }
            });
        }

        me._historyEnabled = true;
    },

    /**
     * @method _getStartupState
     * Getter for the application's original state.
     * @return A copy of the application's original state.
     */
    _getStartupState: function () {
        var ret;
        if (this._startupState) {
            ret =  jQuery.extend(true, {}, this._startupState);
        } else {
            ret = this._startupState;
        }
        return ret;
    },

    /**
     * @method _setStartupState
     * Used to set the application's original state.
     * Stores a _copy_ of the given state.
     * This only stores the state, use useState to put it in use.
     * @param {Object} state Application's original state
     */
    _setStartupState: function (state) {
        this._startupState = jQuery.extend(true, {}, state);
    },

    /**
     * @method saveState
     * @param {Object} view
     * @param {String} pluginName (optional)
     * Calls the saveState method of the given plugin or if not given, calls it
     * for each plugin
     *
     * Used to store the application state though the module/bundle does nothing
     * itself.
     * All actual implementations are done in plugins.
     */
    saveState: function (view, pluginName) {
        var plugName;
        if (!pluginName) {
            for (plugName in this._pluginInstances) {
                if (this._pluginInstances.hasOwnProperty(plugName)) {
                    this.saveState(view, plugName);
                }
            }
            return;
        }
        this.sandbox.printDebug('[' + this.getName() + ']' + ' saving state with ' + pluginName);
        this._pluginInstances[pluginName].saveState(view);
    },
    /**
     * @method getCurrentState
     * @return {Object} JSON object presenting the state of the application at
     * the moment.
     */
    getCurrentState: function () {
        return this.sandbox.getCurrentState();
    },

    /**
     * @method getSavedState
     * @param {String} pluginName
     * Calls the plugins getState()-method.
     * It should return a JSON object created by #getCurrentState on earlier
     * time.
     */
    getSavedState: function (pluginName) {
        return this._pluginInstances[pluginName].getState();
    }
});