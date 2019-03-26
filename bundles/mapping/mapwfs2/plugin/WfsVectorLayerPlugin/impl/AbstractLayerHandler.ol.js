export class AbstractLayerHandler {
    constructor (layerPlugin) {
        this.plugin = layerPlugin;
        this.layerIds = [];
    }
    addMapLayerToMap (layer, keepLayerOnTop, isBaseMap) {
        this.layerIds.push(layer.getId());
    }
    createEventHandlers () {
        return {};
    }
    getStyleFunction (layer, styleFunction, selectedIds) {

    }
    updateLayerProperties (layer, source) {

    }
    /**
     * @private @method _updateLayerStyle
     * @param {Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer} layer
     */
    _updateLayerStyle (layer) {
        if (!this.layerIds.includes(layer.getId())) {
            return;
        }
        this.plugin.updateLayerStyle(layer);
    }
    /**
     * @private @method _updateLayerOpacity
     * @param {Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer} layer
     */
    _updateLayerOpacity (layer) {
        if (!this.layerIds.includes(layer.getId())) {
            return;
        }
        const olLayers = this.plugin.getOLMapLayers(layer);
        if (!olLayers || olLayers.length === 0) {
            return;
        }
        olLayers[0].setOpacity(layer.getOpacity() / 100);
    }
}
