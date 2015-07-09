/**
 * @class Oskari.mapframework.bundle.routingService.request.GetRouteRequest
 * Requests a route with given params
 *
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.routingService.request.GetRouteRequest',
    /**
     * @method create called automatically on construction
     * @static
     *
     * @params {Object}
     *            fromlon, fromlat, tolon, tolat, via, date, time, timetype, via_time, zone, transport_types
     */
    function(params) {
        this._routeparams = params;
    }, {
        /** @static @property __name request name */
        __name : "GetRouteRequest",
        /**
         * @method getName
         * @return {String} request name
         */
        getName : function() {
            return this.__name;
        },
        /**
         * @method getRouteParams
         * @return {Object} parameters given for route
         */
        getRouteParams : function() {
            return this._routeparams;
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol' : ['Oskari.mapframework.request.Request']
    });
