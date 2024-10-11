import { AbstractStatsPluginTool } from './AbstractStatsPluginTool';

class ClassificationTool extends AbstractStatsPluginTool {
    constructor (...args) {
        super(...args);
        this.index = 1;
        this.id = 'allowClassification';
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
};

// Attach protocol to make this discoverable by Oskari publisher
Oskari.clazz.defineES('Oskari.mapframework.publisher.tool.ClassificationTool',
    ClassificationTool,
    {
        protocol: ['Oskari.mapframework.publisher.Tool']
    }
);
