/**
* @class Oskari.lupapiste.bundle.myplaces2.event.ActiveDrawingEvent
*
* Used to notify components of an active drawing. Sends the sketch geometry.
*/
Oskari.clazz.define('Oskari.lupapiste.bundle.myplaces2.event.ActiveDrawingEvent',
/**
* @method create called automatically on construction
* @static
* @param {OpenLayers.Geometry} geometry the drawing that is being drawn
*/
function(geometry, mode) {
    this._drawing = geometry;
    this._drawMode = mode;
}, {
    /** @static @property __name event name */
    __name : "LupaPisteMyPlaces.ActiveDrawingEvent",
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
    getDrawMode : function() {
        return this._drawMode;
    }
}, {
    /**
* @property {String[]} protocol array of superclasses as {String}
* @static
*/
    'protocol' : ['Oskari.mapframework.event.Event']
});