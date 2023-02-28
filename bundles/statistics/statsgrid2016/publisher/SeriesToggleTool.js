Oskari.clazz.define('Oskari.mapframework.publisher.tool.SeriesToggleTool', function () {
}, {
    index: 1,
    group: 'data',
    id: 'series',

    init: function (data) {
        const conf = this.getStatsgridConf(data);
        this.setEnabled(conf.series === true);
    },
    getTool: function (stateData) {
        var me = this;
        if (!me.__tool) {
            me.__tool = {
                id: 'Oskari.statistics.statsgrid.TogglePlugin',
                title: 'allowHidingSeriesControl',
                config: {
                    series: true
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
    isDisplayed: function (data) {
        var stats = this.getStatsgridBundle();
        if (!stats) {
            return false;
        }
        var indicators = stats.getStatisticsService().getStateService().getIndicators();
        var seriesFound = !!(indicators.find(cur => !!cur.series));
        return seriesFound;
    },
    getValues: function () {
        return this.getConfiguration({ series: this.isEnabled() });
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
