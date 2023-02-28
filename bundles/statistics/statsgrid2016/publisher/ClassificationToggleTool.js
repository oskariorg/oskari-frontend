Oskari.clazz.define('Oskari.mapframework.publisher.tool.ClassificationToggleTool', function () {
}, {
    index: 1,
    group: 'data',
    id: 'classification',

    init: function (data) {
        const conf = this.getStatsgridConf(data);
        this.setEnabled(conf.classification === true);
    },
    getTool: function () {
        var me = this;
        if (!me.__tool) {
            me.__tool = {
                id: 'Oskari.statistics.statsgrid.TogglePlugin',
                title: 'allowHidingClassification',
                config: {
                    classification: true
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
            stats.addMapPluginToggleTool(this.id);
        } else {
            stats.togglePlugin.removeTool(this.id);
        }
    },
    getValues: function () {
        return this.getConfiguration({ classification: this.isEnabled() });
    },
    stop: function () {
        var stats = this.getStatsgridBundle();
        if (stats) {
            stats.togglePlugin.removeTool(this.id);
            stats.updateClassficationViewVisibility();
        }
    }
}, {
    'extend': ['Oskari.mapframework.publisher.tool.AbstractStatsPluginTool'],
    'protocol': ['Oskari.mapframework.publisher.Tool']
});
