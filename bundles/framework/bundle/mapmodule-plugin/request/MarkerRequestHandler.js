/**
 * @class Oskari.mapframework.bundle.mapmodule.request.MarkerRequestHandler
 *
 * Handles requests conserning markers.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.request.MarkerRequestHandler',
    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.mapframework.mapmodule.MarkersPlugin} markersPlugin
     *          reference to MarkersPlugin
     */

    function (markersPlugin) {
        this.markersPlugin = markersPlugin;
    }, {
        /**
         * @method handleRequest
         * Handle marker requests. TODO: "add marker request" should be handled here as well
         * but is not implemented yet. Also markers dont have ids yet so request param is ignored
         * @param {Oskari.mapframework.core.Core} core
         *      reference to the application core (reference sandbox core.getSandbox())
         * @param {Oskari.mapframework.bundle.mapmodule.request.RemoveMarkerRequest} request
         *      request to handle
         */
        handleRequest: function (core, request) {
            if (request.getName() === 'MapModulePlugin.RemoveMarkerRequest') {
                this.markersPlugin.removeMapMarkers(request.getMarkerIds());
            }
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        protocol: ['Oskari.mapframework.core.RequestHandler']
    });