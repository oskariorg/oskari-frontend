/**
 * @class Oskari.framework.event.common.FeaturesGetInfoEvent
 *
 * Feature info event for #Oskari.mapframework.domain.VectorLayer.
 *
 * FIXME: this is used like a request with null and hardcoded values, maybe some
 * refactoring should be done
 * See Oskari.mapframework.request.common.GetFeatureInfoRequest
 */
Oskari.clazz.define('Oskari.mapframework.event.common.FeaturesGetInfoEvent',

/**
 * @method create called automatically on construction
 * @static
 *
 * @param {Oskari.mapframework.domain.VectorLayer}
 *            mapLayer selected map layer
 * @param {Object}
 *            mapLayers always set to null? refactor?
 * @param {Number}
 *            lon longitude
 * @param {Number}
 *            lat latitude
 * @param {String}
 *            srsProjectionCode  srs projection code
 * @param {String}
 *            op  always set to "GetFeatureInfo"? TODO: refactor?
 */
function(mapLayer, mapLayers, lon, lat, projCode, op) {
    this._creator = null;
    this._lon = lon;
    this._lat = lat;
    this._mapLayer = mapLayer;
    this._mapLayers = mapLayers;
    this._projCode = projCode;
    this._op = op;
}, {
    /** @static @property __name event name */
    __name : "FeaturesGetInfoEvent",
    /**
     * @method getName
     * @return {String} event name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getLon
     * @return {Number} longitude
     */
    getLon : function() {
        return this._lon;
    },
    /**
     * @method getLat
     * @return {Number} latitude
     */
    getLat : function() {
        return this._lat;
    },
    /**
     * @method
     * @return (String) always set to "GetFeatureInfo"?
     * TODO: refactor?
     */
    getOp : function() {
        return this._op;
    },
    /**
     * @method getMapLayer
     * @return {Oskari.mapframework.domain.VectorLayer} selected map layer
     */
    getMapLayer : function() {
        return this._mapLayer;
    },
    /**
     * @method getMapLayers
     * @return {Object} always null?
     * TODO: refactor?
     * @deprecated
     */
    getMapLayers : function() {
        return this._mapLayers;
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