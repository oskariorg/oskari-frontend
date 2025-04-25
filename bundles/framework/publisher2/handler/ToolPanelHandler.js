import { PublisherToolsList } from '../view/form/PublisherToolsList';
import { StateHandler, controllerMixin } from 'oskari-ui/util';
import { mergeValues } from '../util/util';

class UIHandler extends StateHandler {
    constructor (sandbox, tools) {
        super();
        this.allAvailableTools = Array.isArray(tools) ? tools.toSorted((a, b) => a.index - b.index) : [];
        this.setState({
            tools: [],
            visible: false
        });
    }

    init (data) {
        const tools = [];
        this.allAvailableTools.forEach((tool) => {
            try {
                tool.init(data);
                if (tool.isDisplayed()) {
                    tools.push(tool);
                }
            } catch (err) {
                Oskari.log('ToolPanelHandler').error('Error initializing publisher tool:', tool);
            }
        });
        // Note that handler is for extra component. Every tool doesn't have extra + handler
        // Trigger re-render if handlers state changes
        tools.forEach(tool => tool.getComponent().handler?.addStateListener(() => this.notify()));
        const visible = tools.length > 0;
        this.updateState({ tools, visible });
    }

    setPanelVisibility (visible) {
        this.updateState({ visible });
    }

    getPanelComponent () {
        return PublisherToolsList;
    }

    setToolEnabled (tool, enabled) {
        tool.setEnabled(enabled);
        // trigger re-render
        this.notify();
    }

    getValues () {
        const { tools } = this.getState();
        // TODO: !visible return {} ??
        let values = {};
        tools.forEach(tool => {
            values = mergeValues(values, tool.getValues());
        });
        return values;
    }

    stop () {
        const { tools } = this.getState();
        tools.forEach(tool => {
            try {
                tool.stop();
            } catch (e) {
                Oskari.log('Publisher.ToolPanelHandler')
                    .error('Error stopping publisher tool:', tool.id);
            }
        });
    }
};

const wrapped = controllerMixin(UIHandler, [
    'setToolEnabled'
]);

export { wrapped as ToolPanelHandler };
