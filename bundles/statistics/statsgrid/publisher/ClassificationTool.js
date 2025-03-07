import { AbstractStatsPluginTool } from './AbstractStatsPluginTool';

class ClassificationTool extends AbstractStatsPluginTool {
    constructor (...args) {
        super(...args);
        this.index = 1;
        this.id = 'allowClassification';
        this.state = {
            enabled: true // enabled for default
        };
    }

    init (data) {
        const conf = this.getStatsgridConf(data);
        this.setEnabled(conf[this.id] !== false);
    }

    setEnabled (enabled) {
        if (enabled === this.isEnabled()) {
            return;
        }

        // Stop checks if we are already disabled so toggle the value after
        this.state.enabled = enabled;
        const handler = this.getViewHandler();
        if (!handler) {
            return;
        }
        handler.updateClassificationState('editEnabled', enabled);
    }

    stop () {
        const handler = this.getViewHandler();
        if (!handler) {
            return;
        }
        handler.updateClassificationState('editEnabled', true);
    }

    // override to include config always. setEnabled checks explicitly if false
    getValues () {
        const id = this._getToolId();
        return this.getConfiguration({ [id]: this.isEnabled() });
    }
};

// Attach protocol to make this discoverable by Oskari publisher
Oskari.clazz.defineES('Oskari.mapframework.publisher.tool.ClassificationTool',
    ClassificationTool,
    {
        protocol: ['Oskari.mapframework.publisher.Tool']
    }
);
