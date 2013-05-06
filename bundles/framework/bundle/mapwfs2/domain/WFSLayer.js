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
    this._fields = [];
    this._locales = [];
    this._activeFeatures = [];
}, {
   /* Layer type specific functions */

    /**
     * @method getFields
     */
    getFields : function() {
        return this._fields;
    },

    /**
     * @method setFields
     */
    setFields : function(fields) {
        this._fields = fields;
    },

    /**
     * @method getLocales
     */
    getLocales : function() {
        return this._locales;
    },

    /**
     * @method setLocales
     */
    setLocales : function(locales) {
        this._locales = locales;
    },

    /**
     * @method getActiveFeatures
     */
    getActiveFeatures : function() {
        return this._activeFeatures;
    },

    /**
     * @method setActiveFeature
     */
    setActiveFeature : function(feature) {
        this._activeFeatures.push(feature);
    },

    /**
     * @method setActiveFeatures
     */
    setActiveFeatures : function(features) {
        this._activeFeatures = features;
    }
}, {
    "extend": ["Oskari.mapframework.domain.AbstractLayer"]
});
