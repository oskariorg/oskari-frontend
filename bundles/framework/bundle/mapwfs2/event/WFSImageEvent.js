/**
 * @class Oskari.mapframework.bundle.mapwfs2.event.WFSImageEvent
 *
 * Used to indicate tha a WFS Feature has been selected and components should highlight it in UI
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapwfs2.event.WFSImageEvent',
/**
 * @method create called automatically on construction
 * @static
 *
 * <GIEV MIEH! PARAMS>
 *
 */
function(layer, imageUrl, bbox, layerPostFix, keepPrevious) {
    this._layer = layer;
    this._imageUrl = imageUrl;
    this._bbox = bbox;
    this._layerPostFix = layerPostFix;
    this._keepPrevious = keepPrevious;
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
     */
    getLayer : function() {
        return this._layer;
    },

    /**
     * @method getImageUrl
     */
    getImageUrl : function() {
        return this._imageUrl;
    },

    /**
     * @method getBBOX
     */
    getBBOX : function() {
        return this._bbox;
    },

    /**
     * @method getLayerPostFix
     */
    getLayerPostFix : function() {
        return this._layerPostFix;
    },

    /**
     * @method isKeepPrevious
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
