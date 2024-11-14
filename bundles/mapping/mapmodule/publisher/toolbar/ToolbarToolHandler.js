import { StateHandler, controllerMixin } from 'oskari-ui/util';

class UIHandler extends StateHandler {
    constructor (tool) {
        super();
        this.tool = tool;
        this.setState({
            history_back: false,
            history_forward: false,
            measureline: false,
            measurearea: false
        });
    };

    init (config) {
        this.setState({
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
