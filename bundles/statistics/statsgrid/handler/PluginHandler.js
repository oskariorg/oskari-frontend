import { StateHandler, controllerMixin } from 'oskari-ui/util';

class UIHandler extends StateHandler {
    constructor (consumer) {
        super();
        this.setState({
            plugins: []
        });
        this.loc = Oskari.getMsg.bind(null, 'StatsGrid');
        this.addStateListener(consumer);
    };

    getName () {
        return 'PluginHandler';
    }

    addTool (tool) {
        this.updateState({
            plugins: [
                ...this.getState().plugins,
                tool
            ]
        });
    }

    toggleTool (tool, active) {
        this.updateState({
            plugins: this.getState().plugins.map(plugin => {
                if (plugin.name !== tool) return plugin;
                return {
                    ...plugin,
                    active: active
                };
            })
        });
    }

    removeTool (tool) {
        this.updateState({
            plugins: this.getState().plugins.filter(plugin => plugin.name !== tool)
        });
    }
}

const wrapped = controllerMixin(UIHandler, [
    'addTool',
    'removeTool',
    'toggleTool'
]);

export { wrapped as PluginHandler };
