import { StateHandler, controllerMixin } from 'oskari-ui/util';

class UIHandler extends StateHandler {
    constructor (tool) {
        super();
        this.tool = tool;
        this.sandbox = tool.getSandbox();
        this.setState({
            mode: 'single',
            centerMapAutomatically: false,
            mobileOnly: true
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

    syncState () {
        // required to sync state to plugin on startup and restore the state of the embedded map
    }

    clearState () {
        // plugin is created again on startup, so it's state doesn't need to be cleared
        this.setState({
        });
    }
}

const wrapped = controllerMixin(UIHandler, [
    'updateOptions'
]);

export { wrapped as MyLocationToolHandler };
