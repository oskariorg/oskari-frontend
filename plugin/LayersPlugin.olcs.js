
import LayersPlugin from 'oskari-frontend/bundles/mapping/mapmodule/plugin/layers/LayersPluginClass.ol';

class LayersPluginOlcs extends LayersPlugin {
    /**
     * @method _isLayerImplVisible Tells if given layer is visible or not.
     * @param {Cesium.Cesium3DTileset | olLayer} layer
     */
    _isLayerImplVisible (layer) {
        if (layer instanceof Cesium.Cesium3DTileset) {
            return layer.show;
        } else {
            return layer.getVisible();
        }
    }
    /**
     * @method _setLayerImplVisible Sets layer visibility on map.
     * @param {Cesium.Cesium3DTileset | olLayer} layer
     * @param {Boolean} visible
     */
    _setLayerImplVisible (layer, visible) {
        if (layer instanceof Cesium.Cesium3DTileset) {
            layer.show = visible;
        } else {
            return layer.setVisible(visible);
        }
    }
    /**
     * @method handleMapLayerVisibility
     * Checks layer's visibility (visible, inScale, inGeometry) and sets ol layers' visibilities.
     * notifies bundles about visibility changes by sending MapLayerVisibilityChangedEvent.
     * @param {Oskari.mapframework.domain.AbstractMapLayer} layer layer to check against
     * @param {Boolean} isRequest if MapLayerVisibilityRequest, then trigger always change because layer's visibility has changed
     */
    handleMapLayerVisibility (layer, isRequest) {
        let scaleOk = layer.isVisible();
        let geometryMatch = layer.isVisible();
        let triggerChange = (isRequest === true);
        // if layer is visible check actual values
        if (layer.isVisible()) {
            scaleOk = this._isInScale(layer);
            geometryMatch = this.isInGeometry(layer);
        }
        const mapLayers = this.getMapModule().getOLMapLayers(layer.getId());
        if (!mapLayers || !mapLayers.length) {
            if (triggerChange) {
                this.notifyLayerVisibilityChanged(layer, scaleOk, geometryMatch);
            }
            return;
        }
        const visibility = scaleOk && geometryMatch && layer.isVisible();
        mapLayers.forEach(mapLayer => {
            if (visibility !== this._isLayerImplVisible(mapLayer)) {
                this._setLayerImplVisible(mapLayer, visibility);
                triggerChange = true;
            }
        });
        if (triggerChange) {
            this.notifyLayerVisibilityChanged(layer, scaleOk, geometryMatch);
        }
    }
}

Oskari.clazz.defineES('Oskari.mapframework.bundle.mapmodule.plugin.LayersPlugin',
    LayersPluginOlcs,
    {
        'protocol': [
            'Oskari.mapframework.module.Module',
            'Oskari.mapframework.ui.module.common.mapmodule.Plugin'
        ]
    }
);
