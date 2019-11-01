
import { StateHandler, mutatorMixin } from 'oskari-ui/util';
import { LayerListHandler } from './LayerList';

class UIStateHandler extends StateHandler {
    constructor (instance) {
        super();
        this.instance = instance;
        this.layerListHandler = new LayerListHandler(instance);
        this.layerListHandler.addStateListener(layerListState => this.updateState({
            layerList: {
                state: layerListState,
                mutator: this.state.layerList.mutator
            }
        }));
        this.state = {
            layerList: {
                state: this.layerListHandler.getState(),
                mutator: this.layerListHandler.getMutator()
            }
        };
    }

    getLayerListHandler () {
        return this.layerListHandler;
    }

    setTab (tab) {
        this.updateState({ tab });
    }
}

export const LayerViewTabsHandler = mutatorMixin(UIStateHandler, [
    'setTab'
]);
