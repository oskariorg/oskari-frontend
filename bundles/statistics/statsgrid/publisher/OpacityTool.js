import { AbstractStatsPluginTool } from './AbstractStatsPluginTool';

class OpacityTool extends AbstractStatsPluginTool {
    constructor (...args) {
        super(...args);
        this.index = 2;
        this.id = 'transparent';
        this.pluginId = 'Oskari.statistics.statsgrid.ClassificationPlugin';
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
        handler.updateClassificationState('transparent', enabled);
    }

    stop () {
        const handler = this.getViewHandler();
        if (!handler) {
            return;
        }
        handler.updateClassificationState('transparent');
    }
};

// Attach protocol to make this discoverable by Oskari publisher
Oskari.clazz.defineES('Oskari.mapframework.publisher.tool.OpacityTool',
    OpacityTool,
    {
        protocol: ['Oskari.mapframework.publisher.Tool']
    }
);
