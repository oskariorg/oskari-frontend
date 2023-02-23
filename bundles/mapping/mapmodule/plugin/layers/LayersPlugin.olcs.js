import { LayersPlugin } from './LayersPluginClass.ol';

class LayersPluginOlcs extends LayersPlugin {
    /**
     * @method _isLayerImplVisible Tells if given layer is visible or not.
     * @param {Cesium.Cesium3DTileset | olLayer} layer
     */
    _isLayerImplVisible (layer) {
        // NOTE! mapmodule has isLayerVisible() that is the same thing but uses layer id as param
        // OL version doesn't have this method at all
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
}

Oskari.clazz.defineES('Oskari.mapframework.bundle.mapmodule.plugin.LayersPlugin',
    LayersPluginOlcs,
    {
        protocol: [
            'Oskari.mapframework.module.Module',
            'Oskari.mapframework.ui.module.common.mapmodule.Plugin'
        ]
    }
);
