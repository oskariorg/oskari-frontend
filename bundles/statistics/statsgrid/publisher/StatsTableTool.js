import { AbstractStatsPluginTool } from './AbstractStatsPluginTool';

class StatsTableTool extends AbstractStatsPluginTool {
    constructor (...args) {
        super(...args);
        this.index = 4;
        this.group = 'data';
        this.id = 'grid';
        this.title = 'grid';
    }
};

// Attach protocol to make this discoverable by Oskari publisher
Oskari.clazz.defineES('Oskari.mapframework.publisher.tool.StatsTableTool',
    StatsTableTool,
    {
        protocol: ['Oskari.mapframework.publisher.Tool']
    }
);
