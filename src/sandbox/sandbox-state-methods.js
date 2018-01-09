/**
 * @class Oskari.Sandbox.stateMethods
 *
 * This category class adds state methods to Oskari sandbox as they were in
 * the class itself.
 */
Oskari.clazz.category('Oskari.Sandbox', 'state-methods', {
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
     * @method getCurrentState
     * @return {Object} JSON object presenting the state of the application at
     * the moment.
     */
    getCurrentState: function () {
        var state = {};
        var components = this.getStatefulComponents();
        var bundleid;
        for (bundleid in components) {
            if (!components.hasOwnProperty(bundleid)) {
                continue;
            }
            if (components[bundleid].getState) {
                state[bundleid] = {
                    // wrap with additional state property so we can use the same json as in startup configuration
                    'state': components[bundleid].getState()
                };
            } else {
                Oskari.log('Sandbox').warn('Stateful component ' + bundleid + ' doesnt have getState()');
            }
        }
        return state;
    },
    /**
     * @method resetState
     * Resets the application state to the initial state provided by GetAppSetup action route.
     */
    resetState: function () {
        // conf got loaded when application started
        this.useState(Oskari.app.getConfiguration());
    },

    /**
     * Sets application state for stateful bundles. 
     * InitialConf is a configuration object similar to GetAppSetup.configuration with bundleid as keys and a state object under the bundleid key.
     * @param  {Object} initialConf state configuration object including data for all bundles
     */
    useState: function (initialConf) {
        var newStateConfig = jQuery.extend(true, {}, initialConf);
        var components = this.getStatefulComponents();
        var bundleState;
        var bundle;
        var bundleid;
        // loop trough all the stateful bundles.
        for (bundleid in components) {
            if (!components.hasOwnProperty(bundleid)) {
                continue;
            }
            bundle = components[bundleid];
            // Double check that the bundle really is stateful
            if (!bundle.setState) {
                continue;
            }
            // newStateConfig has all the states from GetAppSetup.
            if (newStateConfig[bundleid]) {
                bundleState = newStateConfig[bundleid].state;
            } else {
                bundleState = {};
            }
            // reset to the default state
            bundle.setState(bundleState);
        }
    },
    setSessionExpiring: function (minutes, callback) {
        if (typeof minutes !== 'number' || typeof callback !== 'function') {
            return;
        }
        var milliSeconds = 60 * 1000 * minutes;
        setTimeout(function () {
            callback();
        }, milliSeconds);
    },
    extendSession: function (errorCallback) {
        var url = this.getAjaxUrl() + 'action_route=GetCurrentUser';
        var currentUuid = Oskari.user().getUuid();
        var successCallback = function (res, textStatus, jqXHR) {
            var resUuid = jqXHR.getResponseHeader('currentUserUid');
            if (resUuid !== currentUuid) {
                // the uuid in response was not what we expected
                errorCallback();
            }
        };

        this.ajax(url, successCallback, errorCallback);
    }
});
