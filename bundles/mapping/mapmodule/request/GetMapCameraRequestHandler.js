/**
 * @class Oskari.mapframework.bundle.mapmodule.request.GetMapCameraRequestHandler
 * Handles GetMapCameraRequest requests
 */
Oskari.clazz.define(
    'Oskari.mapframework.bundle.mapmodule.request.GetMapCameraRequestHandler',

    /**
     * @method create called automatically on construction
     * @static
     *
     * @param {Oskari.Sandbox}
     *            sandbox reference to sandbox
     * @param {Oskari.mapframework.ui.module.common.MapModule}
     *            mapModule reference to mapmodule
     */
    function (sandbox, mapModule) {
        this.sandbox = sandbox;
        this.mapModule = mapModule;
    }, {
        /**
         * @method handleRequest
         * Handles the request.
         * @param {Oskari.mapframework.core.Core} core
         *      reference to the application core (reference sandbox core.getSandbox())
         * @param {Oskari.mapframework.request.common.GetMapCameraRequest} request
         *      request to handle
         */
        handleRequest: function (core, request) {
            const camera = this.mapModule.getCamera();
            const name = request.getName();
            const event = Oskari.eventBuilder('GetMapCameraEvent')(name, camera);
            this.sandbox.notifyAll(event);
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        protocol: ['Oskari.mapframework.core.RequestHandler']
    }
);
