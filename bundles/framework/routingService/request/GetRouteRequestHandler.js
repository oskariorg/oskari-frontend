/**
 * @class Oskari.mapframework.bundle.routeService.request.GetRouteRequestHandler
 * Handles Oskari.mapframework.bundle.routeService.request.GetRouteRequest.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.routeService.request.GetRouteRequestHandler',
    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.mapframework.bundle.routingService.RoutingServiceBundleInstance} routingService
     *          reference to routingService
     */
    function (routingService) {
        this.routingService = routingService;
    }, {
        /**
         * @method handleRequest
         * Gets route from the service
         * @param {Oskari.mapframework.core.Core} core
         *      reference to the application core (reference sandbox core.getSandbox())
         * @param {Oskari.mapframework.bundle.routingService.request.GetRouteRequest} request
         *      request to handle
         */
        handleRequest: function (core, request) {
            var params = request.getRouteParams();
            this.routingService.getRoute(params);
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        protocol: ['Oskari.mapframework.core.RequestHandler']
    });
