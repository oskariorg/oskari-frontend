/**
 * @class Oskari.mapframework.bundle.mapwfs2.event.WFSRefreshManualLoadLayersEvent
 *
 * Used to refresh all or one manual-refresh-flagged wfs layer
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapwfs2.event.WFSRefreshManualLoadLayersEvent',
/**
 * @method create called automatically on construction
 * @static
 *
 * @param {Oskari.mapframework.domain.WfsLayer}
 *            mapLayer  maplayer to refresh (option)
 */
function(mapLayer) {
    this._mapLayer = mapLayer;
}, {
    /** @static @property __name event name */
    __name : "WFSRefreshManualLoadLayersEvent",
    /**
     * @method getName
     * @return {String} event name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getMapLayer
     * @return {Oskari.mapframework.domain.WfsLayer} mapLayer  maplayer to be refreshed (option)
     */
    getMapLayer : function() {
        return this._mapLayer;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.event.Event']
});
