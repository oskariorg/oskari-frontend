/**
 * @class Oskari.mapframework.bundle.parcelselector.event.ParcelSelectedEvent
 *
 * Notifies components that parcel with the given fid has been selected.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.parcelselector.event.ParcelSelectedEvent',
/**
 * @method create called automatically on construction
 * @static
 * @param {String} fid The feature ID that defines the parcel that has been selected.
 */
function(fid) {
    this._fid = fid;
}, {
    /**
     * @method getName
     * @return {String} Event name.
     */
    getName : function() {
        return "ParcelSelector.ParcelSelectedEvent";
    },
    /**
     * @method getFid
     * Returns parameter that components reacting to event should know about.
     * @return {String} The feature ID that defines the parcel that has been selected.
     */
    getFid : function() {
        return this._fid;
    }
}, {
    'protocol' : ['Oskari.mapframework.event.Event']
}); 