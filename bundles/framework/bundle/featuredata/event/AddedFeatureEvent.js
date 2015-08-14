/**
 * @class Oskari.mapframework.bundle.featuredata.event.AddedFeatureEvent
 * 
 * Used to notify components that the feature has been added.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.featuredata.event.AddedFeatureEvent',
/**
 * @method create called automatically on construction
 * @static
 * @param {OpenLayers.Geometry} geometry the feature geometry that was finished
 */
function(geometry, drawingMode) {
    this._drawing = geometry;
    this._drawingMode = drawingMode;
}, {
    /** @static @property __name event name */
    __name : "FeatureData.AddedFeatureEvent",
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
     * @method getDrawing
     * Returns the current drawing mode
     * @return {String}
     */
    getDrawingMode : function() {
        return this._drawingMode;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.event.Event']
});
