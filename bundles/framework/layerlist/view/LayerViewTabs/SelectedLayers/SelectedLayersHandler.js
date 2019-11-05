import { StateHandler, mutatorMixin } from 'oskari-ui/util';

class UIService extends StateHandler {
    constructor (instance) {
        super();
        this.instance = instance;
        this.sandbox = instance.getSandbox();
        this.state = {
            layers: this._getLayers()
        };
    }

    _getLayers () {
        return [...this.sandbox.findAllSelectedMapLayers()].reverse();
    }

    updateLayers () {
        this.updateState({ layers: this._getLayers() });
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
        if (fromPosition >= this.state.layers.length) {
            return;
        }
        if (toPosition >= this.state.layers.length) {
            return;
        }
        const layerId = this.state.layers[fromPosition].getId();
        this.sandbox.postRequestByName('RearrangeSelectedMapLayerRequest', [layerId, toPosition]);
    }
}

export const SelectedLayersHandler = mutatorMixin(UIService, [
    'reorderLayers'
]);
