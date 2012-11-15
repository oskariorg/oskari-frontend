/**
 * @class Oskari.mapframework.event.common.AfterMapLayerRemoveEvent
 *
 * Notifies application bundles that a map layer has been removed from selected
 * layers.
 * Triggers on Oskari.mapframework.request.common.RemoveMapLayerRequest
 * Opposite of Oskari.mapframework.event.common.AfterMapLayerAddEvent
 */
Oskari.clazz.define('Oskari.mapframework.event.common.AfterMapLayerRemoveEvent',

/**
 * @method create called automatically on construction
 * @static
 *
 * @param
 * {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer}
 *            mapLayer removed map layer (matching one in MapLayerService)
 */
function(mapLayer) {
    this._creator = null;
    this._mapLayer = mapLayer;
}, {
    /** @static @property __name event name */
    __name : "AfterMapLayerRemoveEvent",
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
     *            added map layer (matching one in MapLayerService)
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