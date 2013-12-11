/**
 * @class Oskari.mapframework.event.common.AfterShowMapLayerInfoEvent
 * 
 * Triggers on Oskari.mapframework.request.common.ShowMapLayerInfoRequest.
 * Populates the layer reference matching the id in request.
 * FIXME: propably unnecessary step, this could be completed with using only the
 * request
 */
Oskari.clazz.define('Oskari.mapframework.event.common.AfterShowMapLayerInfoEvent',
/**
 * @method create called automatically on construction
 * @static
 *
 * @param
 * {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer}
 *            mapLayer highlighted/selected maplayer
 */
function(mapLayer) {
    this._creator = null;
    this._mapLayer = mapLayer;
}, {
    /** @static @property __name event name */
    __name : "AfterShowMapLayerInfoEvent",
    /**
     * @method getName
     * @return {String} event name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getMapLayer
     * @return
     * {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer}
     * selected maplayer
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

/* Inheritance */