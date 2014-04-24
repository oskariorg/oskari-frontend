/**
 * @class Oskari.mapframework.bundle.mapmyplaces.event.GeometryEditorChangeEvent
 * 
 * 
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmyplaces.event.GeometryEditorChangeEvent',
/**
 * @method create called automatically on construction
 * @static
 * @param {Object} Id of geometryeditor layer for changes in geometryeditor layers.
 * @param {boolean} forced redraw forced
 */
function(layerId, forced) {
    this._layerId = layerId;
    this._forced = forced;
}, {
    /**
     * @method getName
     * Returns event name
     * @return {String} The event name.
     */
    getName : function() {
        return "GeometryEditor.GeometryEditorChangeEvent";
    },
    /**
    * @method getLayer
    * Returns  id of myplaces layer.
    * @return {Object}
    */
    getLayerId: function() {
        return this._layerId;
    },
    /**
     * @method isForced
     * Returns forced for redraw
     * @return {boolean}
     */
    isForced : function() {
        return this._forced;
    }
}, {
    'protocol' : ['Oskari.mapframework.event.Event']
});