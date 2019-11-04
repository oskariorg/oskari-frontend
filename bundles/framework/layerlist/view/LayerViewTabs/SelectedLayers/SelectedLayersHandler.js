import { StateHandler, mutatorMixin } from 'oskari-ui/util';

class UIService extends StateHandler {
    constructor (instance) {
        super();
        this.instance = instance;
        this.sandbox = instance.getSandbox();
        this.state = {
            layers: [...this.sandbox.findAllSelectedMapLayers()]
        };
    }

    layerSelectionChanged (layer, isSelected, keepLayersOrder) {
        const layers = [...this.state.layers];
        // add layer
        if (isSelected) {
            const insertToBottom = layer.isBaseLayer() && !keepLayersOrder;
            if (insertToBottom) {
                layers.shift().push(layer);
            } else {
                layers.push(layer);
            }
            this.updateState({ layers });
            return;
        }

        // remove layer
        const found = layers.find(cur => cur.getId() === layer.getId());
        if (!found) {
            return;
        }
        const removeIndex = layers.indexOf(found);
        layers.splice(removeIndex, 1);
        this.updateState({ layers });
    }

    changeLayerOrder (fromPosition, toPosition) {
        if (isNaN(fromPosition)) {
            throw new Error('changeLayerOrder: fromPosition is Not a Number: ' + fromPosition);
        }
        if (isNaN(toPosition)) {
            throw new Error('changeLayerOrder: toPosition is Not a Number: ' + toPosition);
        }
        if (fromPosition === toPosition) {
            // Layer wasn't actually moved, ignore
            return;
        }
        const layers = [...this.state.layers];
        const tmp = layers.splice(fromPosition, 1);
        layers.splice(toPosition, 0, [...tmp]);

        this.updateState({ layers });
    }
}

export const SelectedLayersHandler = mutatorMixin(UIService, [
    'changeLayerOrder',
    'layerSelectionChanged'
]);
