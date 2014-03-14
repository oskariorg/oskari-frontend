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
    /* Layer Type */
    this._layerType = "USERLAYER";
    this._metaType = "USERLAYER";
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
    }
}, {
    "extend": ["Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer"]
});