/**
 * @class Oskari.mapframework.bundle.parcel.event.ParcelLayerUnregisterEvent
 * 
 * Use to notify ParcelInfo bundle that the given layer should not be followed by that bundle anymore.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.parcel.event.ParcelLayerUnregisterEvent', 
/**
 * @method create called automatically on construction
 * @static
 * @param {OpenLayers.Layer.Vector} layer Layer object that should not be follwed anymore by the bundle.
 */
function(layer) {
    this._layer = layer;
}, {
    /**
     * @method getName
     * Returns event name
     * @return {String} The event name.
     */
    getName : function() {
        return "ParcelInfo.ParcelLayerUnregisterEvent";
    },
    /**
     * @method getLayer
     * Returns parameter that components reacting to event should know about
     * @return {String} The layer that ParcelInfo bundle should unregister.
     */
    getLayer : function() {
        return this._layer;
    }
}, {
    'protocol' : ['Oskari.mapframework.event.Event']
});