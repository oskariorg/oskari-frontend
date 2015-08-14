/**
 * @class Oskari.mapframework.bundle.metadata.event.MapSelectionEvent
 * 
 * Used to notify components that the drawing has been finished. 
 */
Oskari.clazz.define('Oskari.mapframework.bundle.metadata.event.MapSelectionEvent', 
/**
 * @method create called automatically on construction
 * @static
 * @param {OpenLayers.Geometry} geometry the drawing that was finished
 */
function(geometry) {
    this._drawing = geometry;
}, {
    /** @static @property __name event name */
    __name : "Metadata.MapSelectionEvent",
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
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.event.Event']
});
