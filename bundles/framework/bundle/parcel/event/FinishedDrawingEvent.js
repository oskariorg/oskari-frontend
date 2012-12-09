/**
 * @class Oskari.mapframework.bundle.parcel.event.FinishedDrawingEvent
 *
 * Used to notify components that the drawing has been finished.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.parcel.event.FinishedDrawingEvent',
/**
 * @method create called automatically on construction
 * @static
 * @param {OpenLayers.Feature} feature the drawing that was finished
 * @param {Boolean} blnEdit true if the feature was opened in edit mode
 */
function(feature, blnEdit) {
    this._drawing = feature;
    this._modification = (blnEdit == true);
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
     * @return {OpenLayers.Feature}
     */
    getDrawing : function() {
        return this._drawing;
    },
    /**
     * @method isModification
     * Returns true if drawing was initially opened for editing (not a new one)
     * @return {Boolean}
     */
    isModification : function() {
        return this._modification;
    }
}, {
    'protocol' : ['Oskari.mapframework.event.Event']
});
