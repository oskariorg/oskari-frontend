/**
 * @class Oskari.mapframework.domain.WmsLayer
 *
 * MapLayer of type WMS
 */
Oskari.clazz.define('Oskari.mapframework.domain.WmsLayer', 

/**
 * @method create called automatically on construction
 * @static
 */
function() {
}, {
    /**
     * @method isLayerOfType
     * @param {String} flavour layer type to check against. A bit misleading since setType is base/group/normal, this is used to check if the layer is a WMS layer.
     * @return {Boolean} true if flavour is WMS or wms
     */
    isLayerOfType : function(flavour) {
        return flavour === 'WMS' || flavour === 'wms';
    }
}, {
    "extend" : ["Oskari.mapframework.domain.AbstractLayer"]
});
