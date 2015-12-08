/**
 * @class Oskari.lupapiste.bundle.myplaces2.event.FinishedDrawingEvent
 * 
 * Used to notify components that the drawing has been finished. 
 */
Oskari.clazz.define('Oskari.lupapiste.bundle.lupakartta.event.PlaceSaved', 
/**
 * @method create called automatically on construction
 * @static
 * @param {OpenLayers.Geometry} geometry the drawing that was finished
 * @param {Boolean} blnEdit true if the geometry was opened in edit mode
 */
function(places) {
    this._places = places;
}, {
    /** @static @property __name event name */
    __name : "Lupapiste.PlaceSaved",
    /**
     * @method getName
     * Returns event name
     * @return {String}
     */
    getName : function() {
        return this.__name;
    },

    getPlaces : function() {
        return this._places;
    },
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.event.Event']
});
