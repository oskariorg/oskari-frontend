/**
 * @class Oskari.mapframework.bundle.geometrycutter.FinishedGeometryCuttingEvent
 *
 * Used to notify components that the geometry editing has finished
 */
Oskari.clazz.define('Oskari.mapframework.bundle.geometrycutter.FinishedGeometryCuttingEvent',
/**
 * @method create called automatically on construction
 * @static
 * @param {String} functionalityId 
 * @param {GeoJSONGeometry} geometry the result of the geometry cutting
 */
function(functionalityId, geometry) {
    this._functionalityId = functionalityId;
    this._geometry = geometry;
}, {
    /** @static @property __name event name */
    __name : "GeometryCuttingPlugin.FinishedGeometryCuttingEvent",
    /**
     * @method getName
     * Returns event name
     * @return {String}
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getId
     * Returns the functionality id that started the geometry editing
     * @return {String}
     */
    getId: function() {
        return this._functionalityId;
    },
    /**
     * @method getGeometry
     * Returns the edited geometry
     * @return {GeoJSONGeometry}
     */
    getGeometry : function() {
        return this._filtered;
    }
}, {
    /**
     * @property {String[]} protocol array of protocols the class implements
     * @static
     */
    'protocol' : ['Oskari.mapframework.event.Event']
});
