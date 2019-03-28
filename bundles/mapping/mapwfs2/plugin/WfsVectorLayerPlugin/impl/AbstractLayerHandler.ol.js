export class AbstractLayerHandler {
    constructor (layerPlugin) {
        this.plugin = layerPlugin;
        this.layerIds = [];
        this._log = Oskari.log('Oskari.mapping.mapmodule.AbstractLayerHandler');
    }
    /**
     * @method addMapLayerToMap Adds wfs layer to map
     * Implementing classes should call this function by super.addMapLayerToMap()
     * @param {Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer} layer
     * @param {Boolean} keepLayerOnTop
     * @param {Boolean} isBaseMap
     */
    addMapLayerToMap (layer, keepLayerOnTop, isBaseMap) {
        this.layerIds.push(layer.getId());
    }
    /**
     * @method createEventHandlers Creates layer handler specific event handlers
     */
    createEventHandlers () {
        return {
            AfterChangeMapLayerStyleEvent: event => this._updateLayerStyle(event.getMapLayer()),
            AfterChangeMapLayerOpacityEvent: event => this._updateLayerOpacity(event.getMapLayer())
        };
    }
    /**
     * @method getLayerStyleFunction
     * Returns OL style corresponding to the layer's selected style
     * @param {Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer} layer
     * @param {function} styleFunction
     * @param {[number|string]} selectedIds
     * @return {function} style function for the layer
     */
    getStyleFunction (layer, styleFunction, selectedIds) {
        this._log.debug('TODO: getStyleFunction() not implemented on LayerHandler');
    }
    /**
     * @method updateLayerProperties
     * Notify about changed features in view
     * @param {Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer} layer
     * @param {ol/source} source
     */
    updateLayerProperties (layer, source) {
        this._log.debug('TODO: updateLayerProperties() not implemented on LayerHandler');
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
