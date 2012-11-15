/**
 * @class Oskari.mapframework.event.common.AfterHighlightMapLayerEvent
 *
 * Triggers when a given map layer has been requested to be
 * "highlighted" on map. This means f.ex. a WMS layer GetFeatureInfo clicks needs
 * to be enabled, WFS layers featuretype grid should be shown and selection clicks
 * on map enabled.
 * Opposite of Oskari.mapframework.event.common.AfterDimMapLayerEvent
 */
Oskari.clazz.define('Oskari.mapframework.event.common.AfterHighlightMapLayerEvent',

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
    __name : "AfterHighlightMapLayerEvent",
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
     * highlighted/selected maplayer
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