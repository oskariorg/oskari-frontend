/**
 * @class Oskari.mapframework.bundle.mapmodule.event.MapLayerVisibilityChangedEvent
 * 
 * This is used to notify that layers visibility has changed. Either the map has 
 * moved out of the layers scale range or the layers geometry is no longer in the maps viewport.
 * Listeners should also check getMapLayer().getVisible() method that indicates if the map has been hidden by the user.
 */
Oskari.clazz.define(
    'Oskari.mapframework.bundle.mapmodule.event.MapLayerVisibilityChangedEvent',
/**
 * @method create called automatically on construction
 * @static
 *
 * @param
 * {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer}
 *      mapLayer maplayer thats visibility changed
 * 
 * @param {Boolean} inScale
 * 		true if layer is in scale
 * @param {Boolean} geometryMatch
 * 		(optional, defaults to true) true if geometry is in current map bbox
 */
    function(mapLayer, inScale, geometryMatch) {
        this._mapLayer = mapLayer;
        this._inScale = (inScale == true);
        // default to true
        this._geomMatch = (geometryMatch != false);
}, {
    /** @static @property __name event name */
    __name : "MapLayerVisibilityChangedEvent",
    getName : function() {
        return this.__name;
    },
    /**
     * @method getMapLayer
 	 * @return {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer}
     */
    getMapLayer : function() {
        return this._mapLayer;
    },
    /**
     * @method isInScale
 	 * @return {Boolean} true if layer is in scale
     */
    isInScale : function() {
        return this._inScale;
    },
    /**
     * @method isGeometryMatch
 	 * @return {Boolean} true if in scale/geometry is visible
     */
    isGeometryMatch : function() {
        return this._geomMatch;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : [ 'Oskari.mapframework.event.Event' ]
});
