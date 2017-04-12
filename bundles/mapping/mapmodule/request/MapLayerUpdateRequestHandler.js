/**
 * @class Oskari.mapframework.bundle.mapmodule.request.MapLayerUpdateRequestHandler
 * Handles MapModulePlugin.MapLayerUpdateRequest requests
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.request.MapLayerUpdateRequestHandler',
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
         * Handles the request
         * @param {Oskari.mapframework.core.Core} core
         *      reference to the application core (reference sandbox core.getSandbox())
         * @param {Oskari.mapframework.bundle.mapmodule.request.MapLayerUpdateRequest} request
         *      request to handle
         */
        handleRequest: function (core, request) {
            var layerId = request.getLayerId();
            var forced = request.isForced();
            var params = request.getParameters();
            this.mapModule.handleMapLayerUpdateRequest(layerId, forced, params);
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        protocol: ['Oskari.mapframework.core.RequestHandler']
    });