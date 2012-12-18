/**
 * @class Oskari.mapframework.bundle.parcel.event.SaveDrawingEvent
 *
 * Used to notify components that the drawing has been finished and the feature should be saved.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.parcel.event.SaveDrawingEvent',
/**
 * @method create called automatically on construction
 * @static
 * @param {OpenLayers.Feature.Vector} feature The feature that should be saved.
 */
function(feature) {
    this._drawing = feature;
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
     * @method getDrawing
     * Returns the drawings feature
     * @return {OpenLayers.Feature.Vector}
     */
    getDrawing : function() {
        return this._drawing;
    },
}, {
    'protocol' : ['Oskari.mapframework.event.Event']
});
