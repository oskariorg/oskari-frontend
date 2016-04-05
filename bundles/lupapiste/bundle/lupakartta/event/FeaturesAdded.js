/**
 * @class Oskari.lupapiste.bundle.myplaces2.event.FinishedDrawingEvent
 * 
 * Used to notify components that the drawing has been finished. 
 */
Oskari.clazz.define('Oskari.lupapiste.bundle.lupakartta.event.FeaturesAdded', 
/**
 * @method create called automatically on construction
 * @static
 * @param {OpenLayers.Geometry} geometry the drawing that was finished
 * @param {Boolean} blnEdit true if the geometry was opened in edit mode
 */
function(features) {
    this._features = features;
}, {
    /** @static @property __name event name */
    __name: "Lupapiste.FeaturesAdded",
    /**
     * @method getName
     * Returns event name
     * @return {String}
     */
    getName : function() {
        return this.__name;
    },

    getFeatures : function() {
        return this._features;
    },
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.event.Event']
});
