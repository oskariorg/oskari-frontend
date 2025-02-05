import { StateHandler, controllerMixin } from 'oskari-ui/util';

class UIHandler extends StateHandler {
    constructor (tool) {
        super();
        this.tool = tool;
        this.setState({
            history_back: true,
            history_forward: true,
            measureline: true,
            measurearea: true
        });
    };

    init (config) {
        const plugin = this.tool?.getPlugin();

        // toggle off the tools not available in given config
        Object.keys(config).forEach((key) => {
            if (!config[key]) {
                plugin.removeToolButton(key);
            };
        });

        this.updateState({
            ...config
        });
    }

    historySelectionChanged (checked) {
        const newState = {
            history_forward: checked,
            history_back: checked
        };
        this.updateState(newState);

        const plugin = this.tool?.getPlugin();
        if (checked) {
            plugin.addToolButton('history_forward');
            plugin.addToolButton('history_back');
        } else {
            plugin.removeToolButton('history_forward');
            plugin.removeToolButton('history_back');
        }
    }

    selectionChanged (selection, checked) {
        const newState = {};
        newState[selection] = checked;
        this.updateState(newState);

        const plugin = this.tool?.getPlugin();
        if (checked) {
            plugin.addToolButton(selection);
        } else {
            plugin.removeToolButton(selection);
        }
    }
};

const wrapped = controllerMixin(UIHandler, [
    'selectionChanged',
    'historySelectionChanged'
]);

export { wrapped as ToolbarToolHandler };
