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
            var longitude = request.getCenterX(),
                latitude = request.getCenterY(),
                zoom = request.getZoom(),
                zoomAdjustment = 0,
                srsName = request.getSrsName(),
                lonlat = [longitude, latitude];

            // transform coordinates to given projection
            if (srsName && (this.mapModule.getProjection() !== srsName)) {
                var isProjectionDefined = Proj4js.defs[srsName];
                if (!isProjectionDefined) {
                    throw 'SrsName not supported!';
                }
                lonlat = new ol.proj.fromLonLat([longitude, latitude], srsName);
            }

            //FIXME: in case it's possible that zoom is something other than an integer (e.g. extent or scale) like in the ol2 implementation,
            //we need to make a separate handling for that.
            var currentZoom = this.mapModule.getZoomLevel() ? this.mapModule.getZoomLevel() : 0;
            zoom = parseInt(zoom);
            if (isNaN(zoom)) {
                zoom = currentZoom;
            }
            zoomAdjustment = zoom - currentZoom;
            this.mapModule.moveMapToLonLat(lonlat, zoomAdjustment, false);
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        protocol: ['Oskari.mapframework.core.RequestHandler']
    }
);
