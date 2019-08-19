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
            var zoom = request.getZoom();
            var srsName = request.getSrsName();
            var lonlat = {
                lon: request.getCenterX(),
                lat: request.getCenterY()
            };

            // transform coordinates to given projection
            lonlat = this.mapModule.transformCoordinates(lonlat, srsName);

            var zoomChange = (zoom || zoom === 0);

            // if zoom is about to change -> Suppress the event
            this.mapModule.centerMap(lonlat, null, !!zoomChange);
            if (zoomChange) {
                const { left, top, bottom, right } = zoom;

                if (left && top && bottom && right) {
                    const zoomOut = top === bottom && left === right;
                    this.mapModule.zoomToExtent(zoom, zoomOut, zoomOut);
                    if (zoomOut) {
                        this.mapModule.zoomToScale(2000);
                    }
                    return;
                }
                if (zoom.scale) {
                    this.mapModule.zoomToScale(zoom.scale, false, false);
                    return;
                }
                this.mapModule.setZoomLevel(zoom, false);
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
