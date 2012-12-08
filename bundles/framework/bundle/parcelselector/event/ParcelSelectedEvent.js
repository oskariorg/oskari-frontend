/**
 * @class Oskari.mapframework.bundle.parcelselector.event.ParcelSelectedEvent
 * 
 * Used to notify components that ... 
 */
Oskari.clazz.define('Oskari.mapframework.bundle.parcelselector.event.ParcelSelectedEvent', 
/**
 * @method create called automatically on construction
 * @static
 * @param {String} fid some information you wish to communicate with the event
 */
function(fid) {
    this._fid = fid;
}, {
    /** @static @property __name event name */
    __name : "ParcelSelector.ParcelSelectedEvent",
    /**
     * @method getName
     * Returns event name
     * @return {String}
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getFid
     * Returns parameter that components reacting to event should know about
     * @return {String}
     */
    getFid : function() {
        return this._fid;
    }
}, {
    'protocol' : ['Oskari.mapframework.event.Event']
});