import { StateHandler, controllerMixin } from 'oskari-ui/util';

class UIHandler extends StateHandler {
    constructor (tools, consumer) {
        super();
        this.allAvailableTools = Array.isArray(tools) ? tools.toSorted((a, b) => a.index - b.index) : [];
        this.setState({
            tools: []
        });
        if (consumer) {
            this.addStateListener(consumer);
        }
    }

    init (data, silent) {
        this.data = data;
        this.state = {
            tools: []
        };

        this.allAvailableTools.forEach((tool) => {
            try {
                tool.init(data);
                if (tool.isDisplayed(data)) {
                    this._addToolToState(tool, silent);
                }
            } catch (err) {
                Oskari.log('ToolPanelHandler').error('Error initializing publisher tool:', tool);
            }
        });

        const { tools } = this.getState();
        return tools.length > 0;
    }

    _addToolToState (tool, silent) {
        const toolComponent = tool.getComponent();
        // silent flag added for statsgrid's purposes
        if (toolComponent.handler && !silent) {
            toolComponent.handler.addStateListener(() => this.notify());
        }
        const { id, title, hideCheckbox } = tool.getTool();
        this.updateState({
            tools: [
                ...this.state.tools,
                {
                    id,
                    title,
                    hideCheckbox,
                    component: toolComponent.component,
                    handler: toolComponent.handler,
                    publisherTool: tool
                }
            ]
        });
    }

    setToolEnabled (tool, enabled) {
        tool.setEnabled(enabled);
        // trigger re-render
        this.notify();
    }

    stop () {
        const { tools } = this.getState();
        tools.forEach(tool => {
            try {
                tool.publisherTool.stop();
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
