/**
 * @class Oskari.mapframework.bundle.parcel.event.ParcelInfoLayerRegisterEvent
 * 
 * Used to notify components that ... 
 */
Oskari.clazz.define('Oskari.mapframework.bundle.parcel.event.ParcelInfoLayerRegisterEvent', 
/**
 * @method create called automatically on construction
 * @static
 * @param {OpenLayers.} layer Layer object whose selection and modification events will be follwed by the bundle.
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
        return "ParcelInfo.ParcelLayerRegisterEvent";
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