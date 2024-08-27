Oskari.clazz.define('Oskari.mapframework.publisher.tool.DiagramTool', function () {
}, {
    index: 1,
    group: 'data',
    id: 'diagram',
    title: 'displayDiagram',

    init: function (data) {
        const conf = this.getStatsgridConf(data);
        this.setEnabled(conf.diagram === true);
    },
    getTool: function () {
        return {
            ...this.getToolInfo(),
            config: {
                diagram: true
            }
        };
    },
    _setEnabledImpl: function (enabled) {
        var stats = this.getStatsgridBundle();
        if (!stats) {
            return;
        }
        if (enabled) {
            stats.togglePlugin.addTool(this.id);
        } else {
            stats.togglePlugin.removeTool(this.id);
        }
    },
    getValues: function () {
        return this.getConfiguration({ diagram: this.isEnabled() });
    },
    _stopImpl: function () {
        var stats = this.getStatsgridBundle();
        if (stats) {
            stats.togglePlugin.removeTool(this.id);
        }
    }
}, {
    'extend': ['Oskari.mapframework.publisher.tool.AbstractStatsPluginTool'],
    'protocol': ['Oskari.mapframework.publisher.Tool']
});
