import { getFieldsAndPropsArrays } from '../util/props';
const FEATURE_DATA_UPDATE_THROTTLE = 1000;

export class AbstractLayerHandler {
    constructor (layerPlugin) {
        this.plugin = layerPlugin;
        this.layerIds = [];
        this.throttledUpdates = new Map();
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
    updateLayerProperties (layer, source = this._getLayerSource(layer)) {
        if (this.throttledUpdates.has(layer.getId())) {
            const throttledUpdate = this.throttledUpdates.get(layer.getId());
            throttledUpdate();
            return;
        }
        const update = () => this._updateLayerProperties(layer, source);
        const throttledUpdate = Oskari.util.throttle(update, FEATURE_DATA_UPDATE_THROTTLE, { leading: false });
        this.throttledUpdates.set(layer.getId(), throttledUpdate);
        throttledUpdate();
    }
    /**
     * @method refreshLayer forces feature update on layer
     * @param {Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer} layer
     */
    refreshLayer (layer) {
        this._log.debug('TODO: refreshLayer() not implemented on LayerHandler');
    }
    _updateLayerProperties (layer, source) {
        if (!layer.isVisible()) {
            layer.setActiveFeatures([]);
            layer.setFields([]);
            this.plugin.notify('WFSPropertiesEvent', layer, layer.getLocales(), []);
            return;
        }
        const { left, bottom, right, top } = this.plugin.getSandbox().getMap().getBbox();
        const propsList = this._getFeaturePropsInExtent(source, [left, bottom, right, top]);
        const { fields, properties } = getFieldsAndPropsArrays(propsList);
        layer.setActiveFeatures(properties);
        // Update fields and locales only if fields is not empty and it has changed
        if (fields && fields.length > 0 && !Oskari.util.arraysEqual(layer.getFields(), fields)) {
            layer.setFields(fields);
            this.plugin.setLayerLocales(layer);
        }
        this.plugin.notify('WFSPropertiesEvent', layer, layer.getLocales(), fields);
    }
    _getFeaturePropsInExtent (source, extent) {
        if (typeof source.getFeaturePropsInExtent === 'function') {
            return source.getFeaturePropsInExtent(extent);
        }
        if (typeof source.getFeaturesInExtent === 'function') {
            return source.getFeaturesInExtent(extent).map(ftr => ftr.getProperties());
        }
        return [];
    }
    /**
     * Returns source corresponding to given layer
     * @param {Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer} layer
     * @return {ol/source/VectorTile}
     */
    _getLayerSource (oskariLayer) {
        const olLayers = this.plugin.getOLMapLayers(oskariLayer);
        if (olLayers && olLayers.length > 0) {
            return olLayers[0].getSource();
        }
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
