/**
 * @class Oskari.mapframework.event.common.FeaturesAvailableEvent
 *
 * Used to add/replace features on a
 * Oskari.mapframework.domain.VectorLayer
 * See Oskari.mapframework.mapmodule.VectorLayerPlugin
 */
Oskari.clazz.define('Oskari.mapframework.event.common.FeaturesAvailableEvent',

/**
 * @method create called automatically on construction
 * @static
 *
 * @param {Oskari.mapframework.domain.VectorLayer}
 *            mapLayer highlighted/selected maplayer
 * @param {Mixed}
 *            features featuredata in #getMimeType format
 * @param {String}
 *            mimeType see
 * #Oskari.mapframework.mapmodule.VectorLayerPlugin.registerVectorFormats()
 * @param {String}
 *            projCode srs projection code
 * @param {String}
 *            op operation to perform
 */
function(mapLayer, features, mimeType, projCode, op) {
    this._creator = null;
    this._features = features;
    this._op = op;
    this._mapLayer = mapLayer;
    this._mimeType = mimeType;
    this._projCode = projCode;
}, {
    /** @static @property __name event name */
    __name : "FeaturesAvailableEvent",
    /**
     * @method getName
     * @return {String} event name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getFeatures
     * @return {Mixed} featuredata in #getMimeType format
     */
    getFeatures : function() {
        return this._features;
    },
    /**
     * @method getOp
     * @return {String} operation to perform
     */
    getOp : function() {
        return this._op;
    },
    /**
     * @method getMapLayer
     * @return {Oskari.mapframework.domain.VectorLayer}
     * selected maplayer
     */
    getMapLayer : function() {
        return this._mapLayer;
    },
    /**
     * @method getMimeType
     * @return {String} see
     * Oskari.mapframework.mapmodule.VectorLayerPlugin.registerVectorFormats()
     */
    getMimeType : function() {
        return this._mimeType;
    },
    /**
     * @method getProjCode
     * @return {String} srs projection code
     */
    getProjCode : function() {
        return this._projCode;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.event.Event']
});

/* Inheritance */