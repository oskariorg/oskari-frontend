import { StateHandler, controllerMixin } from 'oskari-ui/util';

class UIHandler extends StateHandler {
    constructor (tools, consumer) {
        super();
        this.toolsToInit = tools ? [...tools] : [];
        this.setState({
            tools: []
        });
        this.addStateListener(consumer);
    }

    init (data) {
        this.data = data;
        while (this.toolsToInit.length) {
            const tool = this.toolsToInit.shift();
            try {
                tool.init(data);
                if (tool.isDisplayed(data)) {
                    this._addToolToState(tool);
                }
            } catch (err) {
                Oskari.log('ToolPanelHandler').error('Error initializing publisher tool:', tool);
            }
        }
        const { tools } = this.getState();
        return tools.length > 0;
    }

    _addToolToState (tool) {
        const toolComponent = tool.getComponent();
        if (toolComponent.handler) {
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
                    .error('Error stopping publisher tool:', tool.getTool().id);
            }
        });
    }
};

const wrapped = controllerMixin(UIHandler, [
    'setToolEnabled'
]);

export { wrapped as ToolPanelHandler };
