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
     * @param {Oskari.mapframework.sandbox.Sandbox}
     *            sandbox reference to sandbox
     * @param {Oskari.mapframework.ui.module.common.MapModule}
     *            mapModule reference to mapmodule
     */
    function(sandbox, mapModule) {
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
        handleRequest: function(core, request) {
            var zoom = request.getZoom(),
                srsName = request.getSrsName(),
                lonlat = {
                    lon : request.getCenterX(),
                    lat : request.getCenterY()
                };

            // transform coordinates to given projection
            lonlat = this.mapModule.transformCoordinates(lonlat, srsName);

            this.mapModule.moveMapToLonLat(lonlat, zoom, false);
            // if zoom=0 -> if(zoom) is determined as false...
            if (zoom || zoom === 0) {
                if (zoom.left && zoom.top && zoom.bottom && zoom.right) {
                    this.mapModule.zoomToExtent(zoom);
                } else if (zoom.scale) {
                    this.mapModule.zoomToScale(zoom.scale);
                } else {
                    this.mapModule.zoomTo(zoom);
                }
            }

            this.sandbox.printDebug('[MapMoveRequestHandler] map moved');
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        protocol: ['Oskari.mapframework.core.RequestHandler']
    }
);
