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
}, {
    setDescription: function(desc) {
        this.description = desc;
    },
    getDescription: function() {
        return this.description;
    },
    setSource: function(source) {
        this.source = source;
    },
    getSource: function() {
        return this.source;
    },
    setRenderingElement: function(element) {
        this.renderingElement = element;
    },
    getRenderingElement: function() {
        return this.renderingElement;
    }
}, {
    "extend": ["Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer"]
});