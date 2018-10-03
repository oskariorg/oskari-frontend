/**
 * @class Oskari.mapframework.bundle.mapmodule.request.VectorLayerRequestHandler
 * Handles Oskari.mapframework.bundle.mapmodule.request.VectorLayerRequest requests
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.request.VectorLayerRequestHandler',
    /**
     * @method create called automatically on construction
     * @static
     *
     * @param {Oskari.Sandbox} sandbox reference to sandbox
     * @param {Oskari.mapframework.mapmodule.VectorFeatureService} service reference to vector feature service
     */
    function (sandbox, service) {
        this.sandbox = sandbox;
        this.service = service;
    }, {
        /**
         * @method handleRequest
         * Handles the request
         * @param {Oskari.mapframework.core.Core} core reference to the application core (reference sandbox core.getSandbox())
         * @param {Oskari.mapframework.bundle.mapmodule.request.VectorLayerRequest} request request to handle
         */
        handleRequest: function (core, request) {
            this.service.handleVectorLayerRequest(request);
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        protocol: ['Oskari.mapframework.core.RequestHandler']
    }
);
