/**
 * @class Oskari.mapframework.bundle.myplacesimport.domain.UserLayer
 *
 * MapLayer of type UserLayer
 */
Oskari.clazz.define('Oskari.mapframework.bundle.myplacesimport.domain.UserLayer',

/**
 * @method create called automatically on construction
 * @static
 */
function() {
    this._layerType = "USERLAYER";
    this._metaType = "USERLAYER";
    this.description = undefined;
    this.source = undefined;
    this.renderingElement = undefined;
    this.featureProperties = []; //property names in fixed order from user_layer table fields column
    this.featurePropertyIndexes = [];
}, {
    setDescription: function(desc) {
        this.description = desc;
    },
    getDescription: function() {
        if (this.description) {
          return Oskari.util.sanitize(this.description);
        }
        return this.description;
    },
    setSource: function(source) {
        this.source = source;
    },
    getSource: function() {
        if (this.source) {
          return Oskari.util.sanitize(this.source);
        }
        return this.source;
    },
    setRenderingElement: function(element) {
        this.renderingElement = element;
    },
    getRenderingElement: function() {
        return this.renderingElement;
    },
    setFeatureProperties: function(fields){
        this.featureProperties = fields;
    },
    getFeatureProperties: function(){
        return this.featureProperties;
    },
    setFeaturePropertyIndexes: function(indexes){
        this.featurePropertyIndexes = indexes;
    },
    getFeaturePropertyIndexes: function(){
        return this.featurePropertyIndexes;
    },
    hasOrder: function(){
        return this.featureProperties && this.featureProperties.length > 1;
    }

}, {
    "extend": ["Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer"]
});
