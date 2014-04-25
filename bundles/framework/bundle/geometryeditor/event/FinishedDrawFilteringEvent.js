/**
 * @class Oskari.mapframework.ui.module.common.geometryeditor.DrawFilterPlugin.event.FinishedDrawFilteringEvent
 * 
 * Used to notify components that the drawing has been finished. 
 */
Oskari.clazz.define('Oskari.mapframework.ui.module.common.geometryeditor.DrawFilterPlugin.event.FinishedDrawFilteringEvent',
/**
 * @method create called automatically on construction
 * @static
 * @param {OpenLayers.Geometry} geometry the drawing that was finished
 * @param {Boolean} blnEdit true if the geometry was opened in edit mode
 */
function(geometry, blnEdit, creatorId) {
    this._selection = geometry;
    this._modification = (blnEdit == true);
    this._creatorId = creatorId;
}, {
    /** @static @property __name event name */
    __name : "DrawFilterPlugin.FinishedDrawFilteringEvent",
    /**
     * @method getName
     * Returns event name
     * @return {String}
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getSelection
     * Returns the selection geometry
     * @return {OpenLayers.Geometry}
     */
    getSelection : function() {
        return this._selection;
    },
    /**
     * @method isModification
     * Returns true if drawing was initially opened for editing (not a new one) 
     * @return {Boolean}
     */
    isModification : function() {
        return this._modification;
    },
    getCreatorId: function() {
        return this._creatorId;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.event.Event']
});
