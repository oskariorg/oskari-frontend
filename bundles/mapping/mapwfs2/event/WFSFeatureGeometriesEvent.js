/**
 * @class Oskari.mapframework.bundle.mapwfs2.event.WFSFeatureGeometriesEvent
 *
 * Used to get feature geometries of those WFS Features, which has been highlighted
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapwfs2.event.WFSFeatureGeometriesEvent',
/**
 * @method create called automatically on construction
 * @static
 *
 * @param {Oskari.mapframework.domain.WfsLayer}
 *            mapLayer highlighted/selected maplayer
 *            maplayer.getClickedGeometries() [[layerid, geom],..]
 * @param {Boolean}
 *            keepSelection true if this should append previous selection
 */
function(mapLayer, keepSelection) {
    this._addToSelection = !!keepSelection;
    this._mapLayer = mapLayer;
}, {
    /** @static @property __name event name */
    __name : "WFSFeatureGeometriesEvent",
    /**
     * @method getName
     * @return {String} event name
     */
    getName : function() {
        return this.__name;
    },

    /**
     * @method isKeepSelection
     * @return {Boolean} true if geometry is appended to previous one
     */
    isKeepSelection : function() {
        return this._addToSelection;
    },
    /**
     * @method getMapLayer
     * @return {Oskari.mapframework.domain.WfsLayer} mapLayer highlighted/selected maplayer
     */
    getMapLayer : function() {
        return this._mapLayer;
    },
    /**
         * @method getGeometries [[layerid,geom]..]
         * @return [[layerid,geom]..] mapLayer highlighted/selected maplayer
    */
    getGeometries : function() {
        return this._mapLayer.getClickedGeometries();
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.event.Event']
});
