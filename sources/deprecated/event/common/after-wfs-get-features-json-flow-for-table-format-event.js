/**
 * @class Oskari.mapframework.event.common.AfterWfsGetFeaturesJsonFlowForTableFormatEvent
 *
 * Returns the featuredata for the current map view to be shown in featuredata
 * grid
 */
Oskari.clazz.define('Oskari.mapframework.event.common.AfterWfsGetFeaturesJsonFlowForTableFormatEvent',

/**
 * @method create called automatically on construction
 * @static
 *
 * @param {Oskari.mapframework.domain.WfsLayer}
 *            mapLayer highlighted/selected maplayer
 * @param {Object}
 *            data JSON representation of the data for grid
 * @param {OpenLayers.Bounds}
 *            bbox map bounding box for current data
 */
function(mapLayer, data, bbox) {
    this._creator = null;
    this._mapLayer = mapLayer;
    this._data = data;
    this._bbox = bbox;
}, {
    /** @static @property __name event name */
    __name : "AfterWfsGetFeaturesJsonFlowForTableFormatEvent",
    /**
     * @method getName
     * @return {String} event name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getMapLayer
     * @return {Oskari.mapframework.domain.WfsLayer}
     * selected maplayer
     */
    getMapLayer : function() {
        return this._mapLayer;
    },
    /**
     * @method getData
     * @return {Object}
     *      JSON representation of the data for grid
     */
    getData : function() {
        return this._data;
    },
    /**
     * @method getBbox
     * @return {OpenLayers.Bounds}
     *            map bounding box for current data
     */
    getBbox : function() {
        return this._bbox;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.event.Event']
});

/* Inheritance */