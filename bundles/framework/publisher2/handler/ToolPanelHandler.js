import { StateHandler, controllerMixin } from 'oskari-ui/util';

class UIHandler extends StateHandler {
    constructor (tools, consumer) {
        super();
        this.toolsToInit = tools || [];
        this.setState({
            tools: []
        });
        this.addStateListener(consumer);
    }

    init (data) {
        this.data = data;
        while (this.toolsToInit.length) {
            const tool = this.toolsToInit.shift();
            tool.init(data);
            this._addToolToState(tool);
        }
        const { tools } = this.getState();
        return tools.some(tool => tool.publisherTool.isDisplayed(data));
    }

    _addToolToState (tool) {
        const toolComponent = tool.getComponent();
        if (toolComponent.handler) {
            toolComponent.handler.addStateListener(() => this.notify());
        }
        this.updateState({
            tools: [
                ...this.state.tools,
                {
                    component: toolComponent.component,
                    handler: toolComponent.handler,
                    publisherTool: tool,
                    id: tool.getTool().id,
                    title: tool.getTool().title
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
