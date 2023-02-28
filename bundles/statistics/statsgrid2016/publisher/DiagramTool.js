Oskari.clazz.define('Oskari.mapframework.publisher.tool.DiagramTool', function () {
}, {
    index: 1,
    group: 'data',
    id: 'diagram',

    init: function (data) {
        const conf = this.getStatsgridConf(data);
        this.setEnabled(conf.diagram === true);
    },
    getTool: function (stateData) {
        var me = this;
        if (!me.__tool) {
            me.__tool = {
                id: 'Oskari.statistics.statsgrid.TogglePlugin',
                title: 'displayDiagram',
                config: {
                    diagram: true
                }
            };
        }
        return me.__tool;
    },
    setEnabled: function (enabled) {
        var me = this;
        var changed = me.state.enabled !== enabled;
        me.state.enabled = enabled;

        var stats = this.getStatsgridBundle();
        if (!stats || !changed) {
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
    stop: function () {
        var stats = this.getStatsgridBundle();
        if (stats) {
            stats.togglePlugin.removeTool(this.id);
        }
    }
}, {
    'extend': ['Oskari.mapframework.publisher.tool.AbstractStatsPluginTool'],
    'protocol': ['Oskari.mapframework.publisher.Tool']
});
