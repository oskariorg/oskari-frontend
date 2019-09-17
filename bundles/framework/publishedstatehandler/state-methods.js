Oskari.clazz.category('Oskari.mapframework.bundle.publishedstatehandler.PublishedStateHandlerBundleInstance', 'state-methods', {

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
        var me = this;
        me._historyEnabled = false;
        me._historyPrevious = [];
        me._historyNext = [];
        me.sandbox.resetState();
        me._historyEnabled = true;
    }
});
