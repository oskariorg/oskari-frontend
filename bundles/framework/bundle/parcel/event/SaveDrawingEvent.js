/**
 * @class Oskari.mapframework.bundle.parcel.event.SaveDrawingEvent
 *
 * Used to notify components that the drawing has been finished and the layer features should be saved.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.parcel.event.SaveDrawingEvent',
/**
 * @method create called automatically on construction
 * @static
 * @param {OpenLayers.Layer.Vector} layer The layer that should be saved.
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
        return "Parcel.SaveDrawingEvent";
    },
    /**
     * @method getLayer
     * Returns the drawings Layer.
     * @return {OpenLayers.Layer.Vector}
     */
    getLayer : function() {
        return this._layer;
    },
}, {
    'protocol' : ['Oskari.mapframework.event.Event']
});
