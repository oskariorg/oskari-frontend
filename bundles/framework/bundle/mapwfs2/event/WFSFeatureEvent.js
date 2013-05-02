/**
 * @class Oskari.mapframework.bundle.mapwfs2.event.WFSFeaturesEvent
 *
 * <GIEV MIEH! COMMENTS>
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapwfs2.event.WFSFeatureEvent',
/**
 * @method create called automatically on construction
 * @static
 *
 * <GIEV MIEH! PARAMS>
 *
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
     */
    getLayer : function() {
        return this._layer;
    },

    /**
     * @method getFeature
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
