/**
 * @class Oskari.mapframework.domain.WfsLayer
 *
 * MapLayer of type WFS
 */
Oskari.clazz.define('Oskari.mapframework.domain.WfsLayer',

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
