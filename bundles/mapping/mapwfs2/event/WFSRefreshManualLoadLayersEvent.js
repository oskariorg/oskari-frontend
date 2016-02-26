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
function(layerId) {
    this._layerId = layerId;
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
     * @method getLayerId
     * @return int mapLayer id for  maplayer to be refreshed (option)
     */
    getLayerId : function() {
        return this._layerId;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.event.Event']
});
