import { AbstractStatsPluginTool } from './AbstractStatsPluginTool';

class ClassificationToggleTool extends AbstractStatsPluginTool {
    constructor (...args) {
        super(...args);
        this.index = 3;
        this.group = 'data';
        this.id = 'classification';
        this.title = 'allowHidingClassification';
    }
};

// Attach protocol to make this discoverable by Oskari publisher
Oskari.clazz.defineES('Oskari.mapframework.publisher.tool.ClassificationToggleTool',
    ClassificationToggleTool,
    {
        protocol: ['Oskari.mapframework.publisher.Tool']
    }
);
