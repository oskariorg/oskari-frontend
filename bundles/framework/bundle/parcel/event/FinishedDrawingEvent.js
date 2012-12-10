/**
 * @class Oskari.mapframework.bundle.parcel.event.FinishedDrawingEvent
 *
 * Used to notify components that the drawing has been finished.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.parcel.event.FinishedDrawingEvent',
/**
 * @method create called automatically on construction
 * @static
 * @param {OpenLayers.Feature.Vector} feature the drawing that was finished
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
        return "Parcel.FinishedDrawingEvent";
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
