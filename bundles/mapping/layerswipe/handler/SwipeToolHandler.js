import { StateHandler, controllerMixin } from 'oskari-ui/util';

class UIHandler extends StateHandler {
    constructor (tool) {
        super();
        this.tool = tool;
        this.sandbox = tool.getSandbox();
        this.setState({
            autoStart: false,
            hideUI: false
        });
    };
    init (pluginConfig) {
        this.updateState({
            ...pluginConfig
        });
    }

    clearState () {
        // plugin is created again on startup, so it's state doesn't need to be cleare
        this.setState({
            autoStart: false,
            hideUI: false
        });
    }

    setAutoStart (value) {
        this.tool.getPlugin().setAutoStart(value);
        this.updateConfig2State();
    }

    setHideUI (value) {
        this.tool.getPlugin().setHideUI(value);
        this.updateConfig2State();
    }

    updateConfig2State () {
        const newConfig = this.tool?.getPlugin()?.getConfig() || {};
        this.updateState({
            ...newConfig
        });
    }
}

const wrapped = controllerMixin(UIHandler, [
    'setAutoStart',
    'setHideUI'
]);

export { wrapped as SwipeToolhandler };
