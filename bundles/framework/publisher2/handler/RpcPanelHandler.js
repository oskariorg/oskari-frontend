import { StateHandler, controllerMixin } from 'oskari-ui/util';

class UIHandler extends StateHandler {
    constructor (data, tools, consumer) {
        super();
        this.data = data;
        this.tools = tools;
        this.state = {
            tools: []
        };
        this.addStateListener(consumer);
        this.init();
    }

    getName () {
        return 'RpcPanelHandler';
    }

    init () {
        this.tools.forEach(tool => {
            tool.init(this.data);
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
