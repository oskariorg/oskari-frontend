/**
 * @class Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer
 *
 * MapLayer of type WFS
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer',

/**
 * @method create called automatically on construction
 * @static
 */
function() {
    /* Layer Type */
    this._layerType = "WFS";
    this._fields = []; // property names
    this._locales = []; // property name locales
    this._activeFeatures = []; // features on screen
    this._selectedFeatures = []; // filtered features
    this._clickedFeatureIds = []; // clicked feature ids
}, {
   /* Layer type specific functions */

    /**
     * @method getFields
     * @return {String[]} fields
     */
    getFields : function() {
        return this._fields;
    },

    /**
     * @method setFields
     * @param {String[]} fields
     */
    setFields : function(fields) {
        this._fields = fields;
    },

    /**
     * @method getLocales
     * @return {String[]} locales
     */
    getLocales : function() {
        return this._locales;
    },

    /**
     * @method setLocales
     * @param {String[]} locales
     */
    setLocales : function(locales) {
        this._locales = locales;
    },

    /**
     * @method getActiveFeatures
     * @return {Object[]} features
     */
    getActiveFeatures : function() {
        return this._activeFeatures;
    },

    /**
     * @method setActiveFeature
     * @param {Object} feature
     */
    setActiveFeature : function(feature) {
        this._activeFeatures.push(feature);
    },

    /**
     * @method setActiveFeatures
     * @param {Object[]} features
     */
    setActiveFeatures : function(features) {
        this._activeFeatures = features;
    },

    /**
     * @method getSelectedFeatures
     * @return {Object[]} features
     */
    getSelectedFeatures : function() {
        return this._selectedFeatures;
    },

    /**
     * @method setSelectedFeature
     * @param {Object} feature
     */
    setSelectedFeature : function(feature) {
        this._selectedFeatures.push(feature);
    },

    /**
     * @method setSelectedFeatures
     * @param {Object[]} features
     */
    setSelectedFeatures : function(features) {
        this._selectedFeatures = features;
    },

    /**
     * @method getClickedFeatureIds
     * @return {String[]} featureIds
     */
    getClickedFeatureIds : function() {
        return this._clickedFeatureIds;
    },

    /**
     * @method setClickedFeatureId
     * @param {String} id
     */
    setClickedFeatureId : function(id) {
        this._clickedFeatureIds.push(id);
    },

    /**
     * @method setClickedFeatureIds
     * @param {String[]} features
     */
    setClickedFeatureIds : function(ids) {
        this._clickedFeatureIds = ids;
    }
}, {
    "extend": ["Oskari.mapframework.domain.AbstractLayer"]
});
