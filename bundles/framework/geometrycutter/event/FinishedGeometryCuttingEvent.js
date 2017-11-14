/**
 * @class Oskari.mapframework.bundle.geometrycutter.FinishedGeometryCuttingEvent
 *
 * Used to notify components that the geometry editing has finished
 */
Oskari.clazz.define('Oskari.mapframework.bundle.geometrycutter.FinishedGeometryCuttingEvent',
/**
 * @method create called automatically on construction
 * @static
 * @param {String} operationId 
 * @param {GeoJSONFeature} feature the result of the geometry cutting, or null if cutting failed (topology exception)
 */
function(operationId, feature) {
    this._operationId = operationId;
    this._feature = feature;
}, {
    /** @static @property __name event name */
    __name : "FinishedGeometryCuttingEvent",
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
     * Returns the operation id that started the geometry editing
     * @return {String}
     */
    getId: function() {
        return this._operationId;
    },
    /**
     * @method getGeometry
     * Returns the edited geometry
     * @return {GeoJSONGeometry}
     */
    getFeature : function() {
        return this._feature;
    }
}, {
    /**
     * @property {String[]} protocol array of protocols the class implements
     * @static
     */
    'protocol' : ['Oskari.mapframework.event.Event']
});
