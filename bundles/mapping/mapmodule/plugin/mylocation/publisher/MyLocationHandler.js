import { StateHandler, controllerMixin } from 'oskari-ui/util';

class UIHandler extends StateHandler {
    constructor (tool) {
        super();
        this.tool = tool;
        const defaults = {
            mode: 'single',
            centerMapAutomatically: false,
            mobileOnly: false
        };
        this.setState({
            ...defaults
        });
    };

    init (pluginConfig) {
        this.updateState({
            ...pluginConfig
        });
    }

    updateOptions (key, value) {
        const newState = this.getState();
        newState[key] = value;
        this.updateState(newState);
    }
}

const wrapped = controllerMixin(UIHandler, [
    'updateOptions'
]);

export { wrapped as MyLocationToolHandler };
