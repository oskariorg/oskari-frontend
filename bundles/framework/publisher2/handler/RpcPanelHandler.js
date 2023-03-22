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
            toolComponent.handler.addStateListener(() => this.notify());
            this.updateState({
                tools: [
                    ...this.state.tools,
                    {
                        component: toolComponent.component,
                        handler: toolComponent.handler,
                        tool
                    }
                ]
            });
        });
        return this.tools.some(tool => tool.isDisplayed(data));
    }

    updateField (field, value) {
        this.updateState({
            [field]: value
        });
    }
}

const wrapped = controllerMixin(UIHandler, [
    'updateField'
]);

export { wrapped as RpcPanelHandler };
