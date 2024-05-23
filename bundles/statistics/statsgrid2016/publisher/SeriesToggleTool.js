Oskari.clazz.define('Oskari.mapframework.publisher.tool.SeriesToggleTool', function () {
}, {
    index: 1,
    group: 'data',
    id: 'series',
    title: 'allowHidingSeriesControl',

    init: function (data) {
        const conf = this.getStatsgridConf(data);
        this.setEnabled(conf.series === true);
    },
    getTool: function () {
        return {
            id: 'Oskari.statistics.statsgrid.TogglePlugin',
            title: this.getTitle(),
            config: {
                series: true
            },
            hasNoPlugin: true
        };
    },
    _setEnabledImpl: function (enabled) {
        var stats = this.getStatsgridBundle();
        if (!stats) {
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
