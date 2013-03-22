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

}, {
   /* Layer type specific functions */
}, {
    "extend": ["Oskari.mapframework.domain.AbstractLayer"]
});
