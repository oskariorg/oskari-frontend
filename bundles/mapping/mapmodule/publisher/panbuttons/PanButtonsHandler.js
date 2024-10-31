import { StateHandler, controllerMixin } from 'oskari-ui/util';

class UIHandler extends StateHandler {
    constructor (tool) {
        super();
        this.tool = tool;
        this.sandbox = tool.getSandbox();
        this.setState({
            showArrows: false
        });
    };

    init (pluginConfig) {
        this.updateState({
            ...pluginConfig
        });
    }

    setShowArrows (value) {
        this.updateState({
            showArrows: value
        });
        this.tool.getPlugin().setShowArrows(value);
    }
}

const wrapped = controllerMixin(UIHandler, [
    'setShowArrows'
]);

export { wrapped as PanButtonsHandler };
