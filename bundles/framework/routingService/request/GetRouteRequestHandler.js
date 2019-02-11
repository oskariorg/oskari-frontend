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
            const params = request.getRouteParams();
            if (!params) {
                this._notifyInvalidParams();
                return;
            }
            // Set lang parameter when it's not present. Lang is a required parameter.
            params.lang = params.lang || Oskari.getLang();
            // Check other required parameters.
            const required = ['srs', 'fromlat', 'fromlon', 'tolat', 'tolon'];
            const requiredParamMissing = required.find(key => params.hasOwnProperty(key));
            if (requiredParamMissing) {
                this._notifyInvalidParams(params);
                return;
            }
            this.routingService.getRoute(params);
        },

        _notifyInvalidParams: function (params) {
            const evt = Oskari.eventBuilder('RouteResultEvent')(false, undefined, undefined, params);
            Oskari.getSandbox().notifyAll(evt);
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        protocol: ['Oskari.mapframework.core.RequestHandler']
    });
