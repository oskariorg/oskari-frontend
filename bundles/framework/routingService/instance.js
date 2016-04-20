/**
 * @class Oskari.mapframework.bundle.routingService.RoutingServiceBundleInstance
 */
Oskari.clazz.define('Oskari.mapframework.bundle.routingService.RoutingServiceBundleInstance',
/**
 * @static constructor function
 */
function () {
    this.sandbox = null;
    this.started = false;
}, {
    __name: 'routingService',

    /**
     * @method getName
     * @return {String} the name for the component
     */
    getName: function () {
        return this.__name;
    },

    /**
     * @method init
     * Initializes the service
     */
    init: function () {
        var me = this;
        this.requestHandlers = {
            getRouteHandler: Oskari.clazz.create('Oskari.mapframework.bundle.routeService.request.GetRouteRequestHandler', me)
        };
        return null;
    },
    /**
     * Registers itself to the sandbox, creates the tab and the service
     * and adds the flyout.
     *
     * @method start
     */
    start: function () {
        var me = this,
            conf = me.conf,
            sandboxName = (conf ? conf.sandbox : null) || 'sandbox',
            sandbox = Oskari.getSandbox(sandboxName);

        this.sandbox = sandbox;
        sandbox.register(this);

        sandbox.addRequestHandler('GetRouteRequest', this.requestHandlers.getRouteHandler);
    },

        /**
         * @method onEvent
         * @param {Oskari.mapframework.event.Event} event a Oskari event
         * object
         * Event is handled forwarded to correct #eventHandlers if found
         * or discarded if not.
         */
        onEvent: function (event) {
            var handler = this.eventHandlers[event.getName()];
            if (!handler) {
                return;
            }

            return handler.apply(this, [event]);
        },

    /**
     * @method getRoute
     * Makes the ajax call to get the route from service
     * @param {Object} parameters of the route. Possible values are:
     *                 srs - *required
     *                 lang - fi/sv/en
     *                 fromlat - x coordinate of the starting point *required
     *                 fromlon - y coordinate of the starting point *required
     *                 tolat - x coordinate of the destination point *required
     *                 tolon - y coordinate of the destination point *required
     *                 date - YYYYMMDD
     *                 time - HHMM
     *                 timetype - {Boolean} true if is departure time, false if arrival time
     *                 vialat - x coordinate of the via point
     *                 vialon - y coordinate of the via point
     *                 via_time - Minimum time spent at a via_point in minutes
     *                 zone - Ticket zone
     *                 transport_types
     */
    getRoute: function (params) {
        var me = this;
            getRouteUrl = this.sandbox.getAjaxUrl() + 'action_route=Routing';

        jQuery.ajax({
            data: params,
            dataType : "json",
            type : "GET",
            beforeSend: function(x) {
              if(x && x.overrideMimeType) {
               x.overrideMimeType("application/json");
              }
             },
            url : getRouteUrl,
            error : this.routeError,
            success : function (response) {
                var success = response.success,
                    requestParameters = response.requestParameters,
                    plan = response.plan;

                var evt = me.sandbox.getEventBuilder('RouteResultEvent')(success, requestParameters, plan);
                me.sandbox.notifyAll(evt);
            }
        });
    },

    routeError: function (response) {
        // TODO: send an event about failure (for RPC etc)
    }
});