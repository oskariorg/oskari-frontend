/**
 * @class Oskari.mapframework.bundle.statehandler.Plugin
 *
 * Protocol/interface declaration for
 * Oskari.mapframework.bundle.ui.module.statehandler.StateHandlerModule plugins.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.statehandler.plugin.Plugin',
    /**
     * @method create called automatically on construction
     * @static
     *
     * @throws "Oskari.mapframework.bundle.statehandler.Plugin should not be instantiated"
     */

    function () {
        throw new Error('Oskari.mapframework.bundle.statehandler.Plugin should not be instantiated');
    }, {
        /**
         * @method getName
         * @throws "Implement your own"
         */
        getName: function () {
            throw new Error('Implement your own');
        },
        /**
         * @method setHandler
         * @param {Oskari.mapframework.bundle.statehandler.ui.module.StateHandlerModule} stateHandler reference to actual state handler
         *
         * Called by Oskari.mapframework.bundle.statehandler.ui.module.StateHandlerModule when registering the plugin.
         * @throws "Implement your own"
         */
        setHandler: function (stateHandler) {
            throw new Error('Implement your own');
        },
        /**
         * @method startPlugin
         * @param {Oskari.Sandbox} sandbox
         *          reference to application sandbox
         * @throws "Implement your own"
         */
        startPlugin: function (sandbox) {
            throw new Error('Implement your own');
        },
        /**
         * @method stopPlugin
         * @param {Oskari.Sandbox} sandbox
         *          reference to application sandbox
         * @throws "Implement your own"
         */
        stopPlugin: function (sandbox) {
            throw new Error('Implement your own');
        },
        /**
         * @method getState
         * @return {Object} JSON presentation of application state as seen by the plugin
         * @throws "Implement your own"
         */
        getState: function () {
            throw new Error('Implement your own');
        },
        /**
         * @method resetState
         * Resets the state in the plugin if applicable
         * @throws "Implement your own"
         */
        resetState: function () {
            throw new Error('Implement your own');
        },
        /**
         * @method saveState
         * @param {String} viewName name for the view
         * @param {Object} state JSON presentation of application state
         * If param is not given, uses
         * Oskari.mapframework.bundle.ui.module.statehandler.StateHandlerModule.getCurrentState()
         * to get the current application state.
         * Saves the state.
         * @throws "Implement your own"
         */
        saveState: function (viewName, state) {
            throw new Error('Implement your own');
        }
    });
