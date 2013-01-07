/**
 * @class Oskari.mapframework.bundle.parcel.event.ParcelInfoLayerRegisterEvent
 * 
 * Use to notify ParcelInfo bundle that the given layer should be followed by that bundle.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.parcel.event.ParcelInfoLayerRegisterEvent', 
/**
 * @method create called automatically on construction
 * @static
 * @param {OpenLayers.Layer.Vector} layer Layer object whose selection and modification events will be follwed by the bundle.
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
        return "ParcelInfo.ParcelLayerRegisterEvent";
    },
    /**
     * @method getLayer
     * Returns parameter that components reacting to event should know about.
     * @return {String} The layer that ParcelInfo bundle should follow.
     */
    getLayer : function() {
        return this._layer;
    }
}, {
    'protocol' : ['Oskari.mapframework.event.Event']
});