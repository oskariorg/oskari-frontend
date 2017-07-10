/**
 * @class Oskari.mapframework.bundle.mapmodule.request.MapLayerPlaybackRequestHandler
 * Handles MapModulePlugin.MapLayerPlaybackRequest requests
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.request.MapLayerPlaybackRequestHandler',
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
            var time = request.getTime();
            var playing = request.isPlaying();
            var nthStep = request.getStep();
            this.mapModule.handleMapLayerPlaybackRequest(layerId, time, playing, nthStep);
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        protocol: ['Oskari.mapframework.core.RequestHandler']
    });