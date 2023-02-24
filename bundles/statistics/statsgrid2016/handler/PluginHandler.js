import { StateHandler, controllerMixin } from 'oskari-ui/util';

class UIHandler extends StateHandler {
    constructor (consumer) {
        super();
        this.setState({
            plugins: []
        });
        this.loc = Oskari.getMsg.bind(null, 'StatsGrid');
        this.eventHandlers = this.createEventHandlers();
        this.addStateListener(consumer);
    };

    getName () {
        return 'PluginHandler';
    }

    addTool (tool) {
        this.updateState({
            plugins: [
                ...this.state.plugins,
                tool
            ]
        });
    }

    toggleTool (tool, active) {
        this.updateState({
            plugins: this.state.plugins.map(plugin => {
                if (plugin.name !== tool) return plugin;
                return {
                    ...plugin,
                    active: active
                }
            })
        });
    }

    removeTool (tool) {
        this.updateState({
            plugins: this.state.plugins.filter(plugin => plugin.name !== tool)
        });
    }

    createEventHandlers () {
        const handlers = {
        };
        Object.getOwnPropertyNames(handlers).forEach(p => this.sandbox.registerForEventByName(this, p));
        return handlers;
    }

    onEvent (e) {
        var handler = this.eventHandlers[e.getName()];
        if (!handler) {
            return;
        }

        return handler.apply(this, [e]);
    }
}

const wrapped = controllerMixin(UIHandler, [
    'addTool',
    'removeTool',
    'toggleTool'
]);

export { wrapped as PluginHandler };
