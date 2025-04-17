import { StateHandler, controllerMixin } from 'oskari-ui/util';

class UIHandler extends StateHandler {
    constructor (tool) {
        super();
        this.tool = tool;
        this.setState({
            noUI: false,
            hasSupportedProjections: !!this.tool?.toolConfig?.supportedProjections,
            supportedProjections: this.tool?.toolConfig?.supportedProjections
        });
    };

    init (config) {
        super.init(config);
        this.updateState({
            ...config,
            noUI: config?.noUI,
            hasSupportedProjections: !!config?.supportedProjections,
            supportedProjections: config?.supportedProjections
        });
    }

    setNoUI (value) {
        this.updateState({
            noUI: value
        });

        const plugin = this.tool?.getPlugin() || null;
        if (!plugin) {
            return;
        }

        plugin.setNoUI(value);
        if (value) {
            plugin.teardownUI(true);
        } else {
            plugin.redrawUI(Oskari.util.isMobile());
        }
    }

    setSupportedProjections (checked) {
        const supportedProjections = checked && this.tool?.toolConfig?.supportedProjections ? this.tool?.toolConfig?.supportedProjections : null;
        this.updateState({
            supportedProjections
        });
    }
}

const wrapped = controllerMixin(UIHandler, [
    'setNoUI',
    'setSupportedProjections'
]);

export { wrapped as CoordinateToolHandler };
