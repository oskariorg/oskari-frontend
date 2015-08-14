/**
 * @class Oskari.mapframework.sandbox.Sandbox.stateMethods
 *
 * This category class adds state methods to Oskari sandbox as they were in
 * the class itself.
 */
Oskari.clazz.category('Oskari.mapframework.sandbox.Sandbox', 'state-methods', {
    /**
     * @method registerAsStateful
     * Registers given bundle instance to sandbox as stateful
     *
     * @param {String}
     *            pBundleId bundle instance id to which the state will be mapped
     * to
     * @param {Oskari.bundle.BundleInstance}
     *            pInstance reference to actual bundle instance
     */
    registerAsStateful: function (pBundleId, pInstance) {
        this._statefuls[pBundleId] = pInstance;
    },

    /**
     * @method unregisterStateful
     * Unregisters given bundle instance from stateful bundles in sandbox
     *
     * @param {String}
     *            pBundleId bundle instance id which to unregister
     */
    unregisterStateful: function (pBundleId) {
        this._statefuls[pBundleId] = null;
        delete this._statefuls[pBundleId];
    },

    /**
     * @method getStatefulComponents
     * Returns an object that has references to stateful components (see
     * #registerAsStateful).
     * The objects propertynames match the instance id and property value is
     * reference to the stateful component.
     * @return {Object}
     */
    getStatefulComponents: function () {
        return this._statefuls;
    },

    /**
     * @method resetState
     * Resets the application state to the initial state provided by GetAppSetup action route.
     */
    resetState: function () {
        var initialConf = Oskari.app.getConfiguration(), // conf got loaded when application started
            statefuls = this.getStatefulComponents(),
            initialState,
            bundle,
            b;

        // Let's loop trough all the stateful bundles.
        for (b in statefuls) {
            if (statefuls.hasOwnProperty(b)) {
                bundle = statefuls[b];
                // initialConf has all the states gotten from GetAppSetup.
                initialState = initialConf[b].state;

                // Double check that the bundle really is stateful
                if (bundle.setState) {
                    // If it has a default state that's not empty
                    if (!jQuery.isEmptyObject(initialState)) {
                        // reset to the default state
                        bundle.setState(initialState);
                    } else {
                        // otherwise just set an empty state.
                        bundle.setState();
                    }
                }
            }
        }
    },
    setSessionExpiring: function (minutes, callback) {
        var milliSeconds = 60 * 1000 * minutes,
            expireTimeout = setTimeout(function () {
                callback();
            }, milliSeconds);
    },
    extendSession: function (errorCallback) {
        var url = this.getAjaxUrl() + 'action_route=GetCurrentUser',
            currentUuid = this.getUser().getUuid(),
            successCallback = function (res, textStatus, jqXHR) {
                var resUuid = jqXHR.getResponseHeader('currentUserUid');
                if (resUuid !== currentUuid) {
                    // the uuid in response was not what we expected
                    errorCallback();
                }
            };

        this.ajax(url, successCallback, errorCallback);
    }
});