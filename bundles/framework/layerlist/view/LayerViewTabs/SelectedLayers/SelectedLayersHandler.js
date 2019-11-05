import { StateHandler } from 'oskari-ui/util';

class UIService extends StateHandler {
    constructor (instance) {
        super();
        this.instance = instance;
        this.sandbox = instance.getSandbox();
        this.state = {
            layers: this.getLayers()
        };
    }

    getLayers () {
        return [...this.sandbox.findAllSelectedMapLayers()].reverse();
    }

    updateLayers () {
        this.updateState({ layers: this.getLayers() });
    }
}

export { UIService as SelectedLayersHandler };
