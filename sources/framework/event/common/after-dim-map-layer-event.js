/**
 * @class Oskari.framework.event.common.AfterDimMapLayerEvent
 *
 * Triggers when a given "highlighted" map layer has been requested to be
 * "dimmed" on map. This means f.ex. a WMS layer GetFeatureInfo clicks needs to
 * be disabled, WFS layers featuretype grid should be hidden and selection clicks
 * on map disabled.
 * Opposite of Oskari.mapframework.event.common.AfterHighlightMapLayerEvent
 */
Oskari.clazz.define('Oskari.mapframework.event.common.AfterDimMapLayerEvent',

/**
 * @method create called automatically on construction
 * @static
 *
 * @param
 * {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer}
 *            mapLayer dimmed maplayer
 */
function(mapLayer) {
    this._creator = null;
    this._mapLayer = mapLayer;
}, {
    /** @static @property __name event name */
    __name : "AfterDimMapLayerEvent",
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
     * dimmed maplayer
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