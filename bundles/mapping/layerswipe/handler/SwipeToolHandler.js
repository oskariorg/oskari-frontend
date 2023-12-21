import { StateHandler, controllerMixin } from 'oskari-ui/util';

class UIHandler extends StateHandler {
    constructor (tool) {
        super();
        this.tool = tool;
        this.sandbox = tool.getSandbox();
        this.setState({
            autoStart: false,
            noUI: false
        });
    };

    init (pluginConfig) {
        this.updateState({
            ...pluginConfig.conf,
            autoStart: pluginConfig?.state?.active,
            noUI: pluginConfig?.conf?.noUI
        });
    }

    syncState () {
        // required to sync state to plugin on startup and restore the state of the embedded map
        const { autoStart, noUI } = this.getState();
        this.setAutoStart(autoStart);
        this.setHideUI(noUI);
    }

    clearState () {
        // plugin is created again on startup, so it's state doesn't need to be cleared
        this.setState({
            autoStart: false,
            noUI: false
        });
    }

    setAutoStart (value) {
        this.tool.getPlugin().toggleToolState(!!value);
        this.updateConfig2State();
    }

    setHideUI (value) {
        this.tool.getPlugin().setHideUI(value);
        this.updateConfig2State();
    }

    updateConfig2State () {
        this.updateState({
            autoStart: !!this.tool?.getPlugin()?.isActive(),
            noUI: !!this.tool?.getPlugin()?.hasUI()
        });
    }
}

const wrapped = controllerMixin(UIHandler, [
    'setAutoStart',
    'setHideUI'
]);

export { wrapped as SwipeToolhandler };
