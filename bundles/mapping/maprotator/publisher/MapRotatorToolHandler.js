import { StateHandler, controllerMixin } from 'oskari-ui/util';

class UIHandler extends StateHandler {
    constructor (tool) {
        super();
        this.tool = tool;
        this.setState({
            noUI: false
        });
    };

    init (config) {
        this.updateState({
            noUI: config?.noUI
        });
    }

    setNoUI (value) {
        this.updateState({
            noUI: value
        });

        const plugin = this.tool?.getPlugin();
        if (!plugin) {
            return;
        }
        plugin.setConfig({
            ...plugin.getConfig(),
            noUI: value
        });
        plugin.refresh();
    }
}

const wrapped = controllerMixin(UIHandler, [
    'setNoUI'
]);

export { wrapped as MapRotatorToolHandler };
