/**
 * @class Oskari.lupapiste.bundle.myplaces2.event.FinishedDrawingEvent
 * 
 * Used to notify components that the drawing has been finished. 
 */
Oskari.clazz.define('Oskari.lupapiste.bundle.myplaces2.event.FinishedDrawingEvent', 
/**
 * @method create called automatically on construction
 * @static
 * @param {OpenLayers.Geometry} geometry the drawing that was finished
 * @param {Boolean} blnEdit true if the geometry was opened in edit mode
 */
function(geometry, blnEdit) {
    this._drawing = geometry;
    this._modification = (blnEdit == true);
}, {
    /** @static @property __name event name */
    __name : "MyPlaces.FinishedDrawingEvent",
    /**
     * @method getName
     * Returns event name
     * @return {String}
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getDrawing
     * Returns the drawings geometry
     * @return {OpenLayers.Geometry}
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
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.event.Event']
});
