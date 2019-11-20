import { StateHandler, mutatorMixin } from 'oskari-ui/util';

class UIService extends StateHandler {
    constructor (instance) {
        super();
        this.instance = instance;
        this.sandbox = instance.getSandbox();
        const layers = this._getLayers();
        this.state = {
            layers,
            visibilityInfo: layers.map(lyr => this._getInitialVisibilityInfoForLayer(lyr))
        };
    }

    _getLayers () {
        return [...this.sandbox.findAllSelectedMapLayers()].reverse();
    }

    _getInitialVisibilityInfoForLayer (layer) {
        if (!layer) {
            return;
        }
        const info = {
            id: layer.getId(),
            visible: layer.isVisible(),
            inScale: layer.isInScale(),
            geometryMatch: true
        };
        const map = this.sandbox.getMap();
        if (!map.isLayerSupported(layer)) {
            info.unsupported = map.getMostSevereUnsupportedLayerReason(layer);
        }
        return info;
    }

    updateLayers () {
        const layers = this._getLayers();
        const visibilityInfo = layers.map(layer => {
            const existingInfo = this.state.visibilityInfo.find(vis => vis.id === layer.getId());
            if (existingInfo) {
                return existingInfo;
            }
            return this._getInitialVisibilityInfoForLayer(layer);
        });
        this.updateState({ layers, visibilityInfo });
    }

    updateVisibilityInfo (event) {
        const layer = event.getMapLayer();
        const geometryMatch = event.isGeometryMatch();
        const inScale = layer.isInScale();
        const visible = layer.isVisible();
        const visibilityInfo = this.state.visibilityInfo.map(vis => {
            if (vis.id === layer.getId()) {
                return { ...vis, visible, inScale, geometryMatch };
            } else {
                return vis;
            }
        });
        this.updateState({ visibilityInfo });
    }

    reorderLayers (fromPosition, toPosition) {
        if (isNaN(fromPosition)) {
            throw new Error('reorderLayers: fromPosition is Not a Number: ' + fromPosition);
        }
        if (isNaN(toPosition)) {
            throw new Error('reorderLayers: toPosition is Not a Number: ' + toPosition);
        }
        if (fromPosition === toPosition) {
            // Layer wasn't actually moved, ignore
            return;
        }
        const layers = [...this.state.layers];
        if (fromPosition >= layers.length) {
            return;
        }
        if (toPosition >= layers.length) {
            return;
        }
        const layer = layers.splice(fromPosition, 1)[0];
        layers.splice(toPosition, 0, layer);
        this.updateState({ layers });

        // the layer order is reversed in presentation
        // the lowest layer has the highest index
        const toDataPosition = (layers.length - 1) - toPosition;
        this.sandbox.postRequestByName('RearrangeSelectedMapLayerRequest', [layer.getId(), toDataPosition]);
    }

    toggleLayerVisibility (layer) {
        const visibility = layer.isVisible();
        this.sandbox.postRequestByName('MapModulePlugin.MapLayerVisibilityRequest', [layer.getId(), !visibility]);
    }

    changeOpacity (layer, opacity) {
        if (opacity === '') {
            opacity = 0;
        }
        this.sandbox.postRequestByName('ChangeMapLayerOpacityRequest', [layer.getId(), opacity]);
    }

    removeLayer (layer) {
        this.sandbox.postRequestByName('RemoveMapLayerRequest', [layer.getId()]);
    }

    changeLayerStyle (layer, styleName) {
        this.sandbox.postRequestByName('ChangeMapLayerStyleRequest', [layer.getId(), styleName]);
    }

    locateLayer (layer) {
        this.sandbox.postRequestByName('MapModulePlugin.MapMoveByLayerContentRequest', [layer.getId(), true]);
    }
}

export const SelectedLayersHandler = mutatorMixin(UIService, [
    'reorderLayers',
    'removeLayer',
    'changeOpacity',
    'toggleLayerVisibility',
    'changeLayerStyle',
    'locateLayer'
]);
