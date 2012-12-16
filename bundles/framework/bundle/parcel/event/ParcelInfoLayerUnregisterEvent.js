/**
 * @class Oskari.mapframework.bundle.parcel.event.ParcelLayerUnregisterEvent
 * 
 * Used to notify components that ... 
 */
Oskari.clazz.define('Oskari.mapframework.bundle.parcel.event.ParcelLayerUnregisterEvent', 
/**
 * @method create called automatically on construction
 * @static
 * @param {OpenLayers.} layer Layer object that should not be follwed anymore by the bundle.
 */
function(layer) {
    this._layer = layer;
}, {
    /**
     * @method getName
     * Returns event name
     * @return {String}
     */
    getName : function() {
        return "ParcelInfo.ParcelLayerUnregisterEvent";
    },
    /**
     * @method getLayer
     * Returns parameter that components reacting to event should know about
     * @return {String}
     */
    getLayer : function() {
        return this._layer;
    }
}, {
    'protocol' : ['Oskari.mapframework.event.Event']
});