/**
 * @class Oskari.mapframework.bundle.parcelselector.event.ParcelSelectedEvent
 *
 * The feature ID that defines the register unit that has been selected.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.parcelselector.event.RegisterUnitSelectedEvent',
/**
 * @method create called automatically on construction
 * @static
 * @param {String} fid some information you wish to communicate with the event
 */
function(fid) {
    this.fid = fid;
}, {
    /**
     * @method getName
     * @return {String} Event name.
     */
    getName : function() {
        return "ParcelSelector.RegisterUnitSelectedEvent";
    },
    /**
     * @method getFid
     * Returns parameter that components reacting to event should know about.
     * @return {String} The feature ID that defines the register unit that has been selected.
     */
    getFid : function() {
        return this.fid;
    }
}, {
    'protocol' : ['Oskari.mapframework.event.Event']
}); 