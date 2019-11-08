import { StateHandler, mutatorMixin } from 'oskari-ui/util';

class UIService extends StateHandler {
    constructor (instance) {
        super();
        this.instance = instance;
        this.sandbox = instance.getSandbox();
        const layers = this._getLayers();
        this.state = {
            layers,
            visibilityInfo: layers.map(layer => (
                { id: layer.getId(), geometryMatch: true }
            ))
        };
    }

    _getLayers () {
        return [...this.sandbox.findAllSelectedMapLayers()].reverse();
    }

    updateLayers () {
        const layers = this._getLayers();
        const visibilityInfo = layers.map(layer => {
            const id = layer.getId();
            const geometryMatch = this.state.visibilityInfo.find(vis => vis.id === id) || true;
            return { id, geometryMatch };
        });
        this.setState({ ...this.state, layers, visibilityInfo });
    }

    updateLayerVisibility (event) {
        const layerId = event.getMapLayer().getId();
        const geometryMatch = event.isGeometryMatch();
        const visibilityInfo = this.state.visibilityInfo.map(vis => {
            if (vis.id === layerId) {
                return { ...vis, geometryMatch };
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
