import { AbstractStatsPluginTool } from './AbstractStatsPluginTool';

class OpacityTool extends AbstractStatsPluginTool {
    constructor (...args) {
        super(...args);
        this.index = 1;
        this.group = 'data';
        this.id = 'transparent';
        this.title = 'transparent';
        this.pluginId = 'Oskari.statistics.statsgrid.ClassificationPlugin';
    }

    setEnabled (enabled) {
        const handler = this.getViewHandler();
        if (!handler) {
            return;
        }
        handler.getController().updateClassificationState('transparent', enabled);
    }

    stop () {
        const handler = this.getViewHandler();
        if (!handler) {
            return;
        }
        handler.getController().updateClassificationState('transparent');
    }
};

// Attach protocol to make this discoverable by Oskari publisher
Oskari.clazz.defineES('Oskari.mapframework.publisher.tool.OpacityTool',
    OpacityTool,
    {
        protocol: ['Oskari.mapframework.publisher.Tool']
    }
);
