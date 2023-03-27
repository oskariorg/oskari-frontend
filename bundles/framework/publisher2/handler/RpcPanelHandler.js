import { StateHandler, controllerMixin } from 'oskari-ui/util';

class UIHandler extends StateHandler {
    constructor (tools, consumer) {
        super();
        this.tools = tools;
        this.state = {
            tools: []
        };
        this.addStateListener(consumer);
    }

    getName () {
        return 'RpcPanelHandler';
    }

    init (data) {
        this.data = data;
        this.tools.forEach(tool => {
            tool.init(data);
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
                        tool,
                        id: tool.getTool().id,
                        title: tool.getTool().title
                    }
                ]
            });
        });
        return this.tools.some(tool => tool.isDisplayed(data));
    }

    setToolEnabled (tool, enabled) {
        tool.setEnabled(enabled)
        // trigger re-render
        this.notify();
    }
}

const wrapped = controllerMixin(UIHandler, [
    'setToolEnabled'
]);

export { wrapped as RpcPanelHandler };
