/**
 * @class Oskari.mapframework.bundle.statehandler.request.SaveStateRequestHandler
 */
Oskari.clazz.define('Oskari.mapframework.bundle.statehandler.request.SaveStateRequestHandler',
    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.Sandbox} sandbox
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
         * @param {Oskari.mapframework.bundle.statehandler.request.SaveStateRequest} request
         *      request to handle
         */
        handleRequest: function (core, request) {
            this.statehandler.saveState({
                "name": request.getViewName(),
                "description": request.getViewDescription(),
                "isDefault": request.getIsDefault()
            });
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        protocol: ['Oskari.mapframework.core.RequestHandler']
    });