/**
 * @class Oskari.mapframework.bundle.mapwfs2.event.WFSImageEvent
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapwfs2.event.WFSImageEvent',
/**
 * @method create called automatically on construction
 * @static
 *
 * @param {Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer} layer
 * @param {String} url
 * @param {Number[]} bbox
 * @param {Object} size
 * @param {String} post fix
 * @param {Boolean} boundaryTile
 * @param {Boolean} keep previous
 */
function(layer, imageUrl, bbox, size, layerType, boundaryTile, keepPrevious) {
    this._layer = layer;
    this._imageUrl = imageUrl;
    this._bbox = bbox;
    this._size = size;
    this._layerType = layerType;
    this._boundaryTile = !!boundaryTile;
    this._keepPrevious = !!keepPrevious;
}, {
    /** @static @property __name event name */
    __name : "WFSImageEvent",

    /**
     * @method getName
     * @return {String} event name
     */
    getName : function() {
        return this.__name;
    },

    /**
     * @method getLayer
     * @return {Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer} layer
     */
    getLayer : function() {
        return this._layer;
    },

    /**
     * @method getImageUrl
     * @return {String} image url
     */
    getImageUrl : function() {
        return this._imageUrl;
    },

    /**
     * @method getBBOX
     * @return {Number[]} bbox
     */
    getBBOX : function() {
        return this._bbox;
    },

    /**
     * @method getSize
     * @return {Object} size
     */
    getSize : function() {
        return this._size;
    },

    /**
     * @method getLayerType
     * @return {String} layer type
     */
    getLayerType : function() {
        return this._layerType;
    },

    /**
     * @method isBoundaryTile
     * @return {Boolean} boundary tile
     */
    isBoundaryTile : function() {
        return this._boundaryTile;
    },

    /**
     * @method isKeepPrevious
     * @return {Boolean} keep previous
     */
    isKeepPrevious : function() {
        return this._keepPrevious;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.event.Event']
});
