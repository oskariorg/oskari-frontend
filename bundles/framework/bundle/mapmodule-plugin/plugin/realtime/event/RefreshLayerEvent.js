/**
 * @class Oskari.mapframework.bundle.mapmodule.plugin.RealtimePlugin.event.RefreshLayerEvent
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.plugin.RealtimePlugin.event.RefreshLayerEvent', 
/**
 * @method create called automatically on construction
 * @static
 */
function(_layer) {
    this._layer = _layer;
}, {
    /** @static @property __name event name */
    __name : "Realtime.RefreshLayerEvent",
    /**
     * @method getName
     * @return {String} the name for the event 
     */
    getName : function() {
        return this.__name;
    },
    getMapLayer : function() {
        return this._layer;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.event.Event']
});
