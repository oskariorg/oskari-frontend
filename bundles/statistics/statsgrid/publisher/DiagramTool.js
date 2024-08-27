import { AbstractStatsPluginTool } from './AbstractStatsPluginTool';

class DiagramTool extends AbstractStatsPluginTool {
    constructor (...args) {
        super(...args);
        this.index = 1;
        this.group = 'data';
        this.id = 'diagram';
        this.title = 'displayDiagram';
    }
};

// Attach protocol to make this discoverable by Oskari publisher
Oskari.clazz.defineES('Oskari.mapframework.publisher.tool.DiagramTool',
    DiagramTool,
    {
        protocol: ['Oskari.mapframework.publisher.Tool']
    }
);
