/**
 * @class Oskari.mapframework.bundle.mapmodule.request.MapMoveRequestHandler
 * Handles MapMoveRequest requests
 */
Oskari.clazz.define(
    'Oskari.mapframework.bundle.mapmodule.request.MapMoveRequestHandler',

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
        this._log = Oskari.log('MapMoveRequestHandler');
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
            const animation = request.getAnimation();
            const lon = request.getCenterX();
            const lat = request.getCenterY();
            let zoom;
            if (!this.mapModule.isValidLonLat(lon, lat)) {
                if (this.mapModule.isValidBounds(requestZoom)) {
                    this.mapModule.zoomToExtent(requestZoom);
                } else {
                    this._log.warn('Map move requested without valid location or bounds');
                }
                return;
            }
            // transform coordinates to given projection
            const lonlat = this.mapModule.transformCoordinates({ lon, lat }, srsName);

            // check if zoom is not null or undefined
            if (requestZoom != null) {
                // check if request is scale or zoom
                zoom = requestZoom.scale
                    ? { type: 'scale', value: this.mapModule.getResolutionForScale(requestZoom.scale) }
                    : { type: 'zoom', value: requestZoom };
            }
            const success = this.mapModule.centerMap(lonlat, zoom, true, { animation });
            if (success === false) {
                this._log.warn('MapMoveRequest failed');
            }
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        protocol: ['Oskari.mapframework.core.RequestHandler']
    }
);
