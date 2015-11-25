/**
 * @class Oskari.mapframework.bundle.routingService.event.RouteResultEvent
 *
 * Used to notify routingUI that route has been got successfully from the service
 */
Oskari.clazz.define('Oskari.mapframework.bundle.routingService.event.RouteResultEvent',
/**
 * @method create called automatically on construction
 * @static
 * @param {Boolean} success succesfully getted route
 * @param {JSON} requestParameters request parameters
 * @param {JSON} plan parameters of route
 */
function(success, requestParameters, plan) {
    this._success = success;
    this._requestParameters = requestParameters;
    this._plan = plan;
}, {
    /** @static @property __name event name */
    __name : "RouteResultEvent",

    /**
     * @method getName
     * Returns event name
     * @return {String}
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getSuccess
     * Returns the successfully routing info
     * @return {Boolean}
     */
    getSuccess : function() {
        return this._success;
    },
    /**
     * @method getPlan
     * Returns the plan JSON
     * @return {JSON}
     */
    getPlan : function() {
        return this._plan;
    },
    /**
     * @method getRequestParameters
     * Returns request paremeters
     * @return {JSON}
     */
    getRequestParameters : function() {
        return this._requestParameters;
    },

    getParams: function () {
        return {
            success: this._success,
            plan: this._plan,
            requestParameters: this._requestParameters
        };
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.event.Event']
});