import { AbstractStatsPluginTool } from './AbstractStatsPluginTool';

class SeriesToggleTool extends AbstractStatsPluginTool {
    constructor (...args) {
        super(...args);
        this.index = 6;
        this.id = 'series';
    }

    isDisplayed (data) {
        const stats = this.getStatsgridBundle();
        if (!stats) {
            return false;
        }
        const { indicators } = this.getStateHandler().getState();
        return indicators.some(ind => ind.series);
    }
};

// Attach protocol to make this discoverable by Oskari publisher
Oskari.clazz.defineES('Oskari.mapframework.publisher.tool.SeriesToggleTool',
    SeriesToggleTool,
    {
        protocol: ['Oskari.mapframework.publisher.Tool']
    }
);
