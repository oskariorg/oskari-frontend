/**
 * @class Oskari.mapframework.bundle.mapwfs2.event.WFSFeaturesEvent
 *
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapwfs2.event.WFSFeatureEvent',
/**
 * @method create called automatically on construction
 * @static
 *
 * @param {Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer}
 *            layer
 * @param {Object}
 *            feature values
 */
function(layer, feature) {
    this._layer = layer;
    this._feature = feature;
}, {
    /** @static @property __name event name */
    __name : "WFSFeatureEvent",

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
     * @method getFeature
     * @return {Object} feature values
     */
    getFeature : function() {
        return this._feature;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.event.Event']
});
