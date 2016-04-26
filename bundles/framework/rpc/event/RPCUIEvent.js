/**
 * @class Oskari.mapframework.bundle.rpc.event.RPCUIEvent
 *
 * Used to notify routingUI that route has been got successfully from the service
 */
Oskari.clazz.define('Oskari.mapframework.bundle.rpc.event.RPCUIEvent',
/**
 * @method create called automatically on construction
 * @static
 * @param {String} bundle id
 * @param {Boolean/Object} payload
 */
function(bundleId, payload) {
    this._bundleId = bundleId;
    this._payload = payload;
}, {
    /** @static @property __name event name */
    __name : "RPCUIEvent",
    /**
     * @method getName
     * Returns event name
     * @return {String}
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getBundleId
     * Returns
     * @return {String}
     */
    getBundleId : function() {
        return this._bundleId;
    },
    /**
     * @method getPayload
     * Returns
     * @return {}
     */
    getPayload : function() {
        return this._payload;
    },
    getParams: function () {
        return {
            bundleId: this._bundleId
        };
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.event.Event']
});