/**
 * @class Oskari.mapframework.bundle.mapmodule.request.MapTourRequestHandler
 * Handles MapTourRequest requests
 */
Oskari.clazz.define(
    'Oskari.mapframework.bundle.mapmodule.request.MapTourRequestHandler',

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
         * If the request SrsName is not defined in Proj4js.defs then a "SrsName not supported!" exception is thrown.
         *
         * @param {Oskari.mapframework.core.Core} core
         *      reference to the application core (reference sandbox core.getSandbox())
         * @param {Oskari.mapframework.request.common.MapMoveRequest} request
         *      request to handle
         */
        handleRequest: function (core, request) {
            const requestZoom = request.getZoom();
            const srsName = request.getSrsName();
            const coordinates = request.getLocations().map(location => this.mapModule.transformCoordinates(location, srsName));
            const options = request.getOptions();

            let zoom;
            if (requestZoom != null) {
                zoom = requestZoom.scale
                    ? { type: 'scale', value: this.mapModule.getResolutionForScale(requestZoom.scale) }
                    : { type: 'zoom', value: requestZoom };
            }

            this.mapModule.tourMap(coordinates, zoom, options);
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        protocol: ['Oskari.mapframework.core.RequestHandler']
    }
);
