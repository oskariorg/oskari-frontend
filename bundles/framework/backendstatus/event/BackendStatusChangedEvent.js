/**
 * Event is sent when the backend status of a map layer has changed.
 * 
 * @class Oskari.mapframework.bundle.backendstatus.event.BackendStatusChangedEvent
 */
Oskari.clazz.define('Oskari.mapframework.bundle.backendstatus.event.BackendStatusChangedEvent', 
/**
 * @method create called automatically on construction
 * @static
 */
function(layerId, status) {
    this._layerId = layerId;
    this._status = status;
}, {
    /** @static @property __name event name */
    __name : "BackendStatus.BackendStatusChangedEvent",
    /**
     * @method getName
     * @return {String} the name for the event 
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getLayerId
     * @return {String/Number}
     */
    getLayerId: function() {
        return this._layerId;
    },
    /**
     * @method getStatus
     * @return {String}
     */
    getStatus: function() {
        return this._status;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.event.Event']
});
