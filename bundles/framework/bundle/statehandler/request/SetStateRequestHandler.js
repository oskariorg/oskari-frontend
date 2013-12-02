/**
 * @class Oskari.mapframework.bundle.statehandler.request.SetStateRequestHandler
 */
Oskari.clazz.define('Oskari.mapframework.bundle.statehandler.request.SetStateRequestHandler',
    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     *          reference to application sandbox
     * @param {Oskari.mapframework.bundle.statehandler.StateHandlerBundleInstance} statehandler
     *          reference to statehandler
     */

    function (sandbox, statehandler) {
        this.sandbox = sandbox;
        this.statehandler = statehandler;
    }, {
        /**
         * @method handleRequest
         * @param {Oskari.mapframework.core.Core} core
         *      reference to the application core (reference sandbox core.getSandbox())
         * @param {Oskari.mapframework.bundle.statehandler.request.SetStateRequest} request
         *      request to handle
         */
        handleRequest: function (core, request) {
            if (request.getState()) {
                this.statehandler.setCurrentViewId(request.getCurrentViewId());
                this.statehandler.useState(request.getState());
            } else {
                this.statehandler.resetState();
            }
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        protocol: ['Oskari.mapframework.core.RequestHandler']
    });