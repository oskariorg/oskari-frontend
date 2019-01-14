Oskari.clazz.define('Oskari.mapframework.publisher.tool.SeriesToggleTool', function () {
}, {
    index: 1,
    group: 'data',
    allowedLocations: [],
    allowedSiblings: [],
    id: 'series',

    init: function (data) {
        var enabled = data &&
            Oskari.util.keyExists(data, 'configuration.statsgrid.conf') &&
            data.configuration.statsgrid.conf.series === true;
        this.setEnabled(enabled);
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

        var stats = Oskari.getSandbox().findRegisteredModuleInstance('StatsGrid');
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
        var stats = Oskari.getSandbox().findRegisteredModuleInstance('StatsGrid');
        if (!stats) {
            return false;
        }
        var indicators = stats.getStatisticsService().getStateService().getIndicators();
        var seriesFound = !!(indicators.find(cur => !!cur.series));
        return seriesFound;
    },
    getValues: function () {
        var me = this;
        var statsGridState = me.__sandbox.getStatefulComponents().statsgrid.getState();

        var statslayerOnMap = this._getStatsLayer();
        if (!statslayerOnMap || !statsGridState) {
            return null;
        }
        if (!me.state.enabled) {
            return null;
        }
        return {
            configuration: {
                statsgrid: {
                    state: statsGridState,
                    conf: {
                        series: me.state.enabled
                    }
                }
            }
        };
    },
    stop: function () {
        var stats = Oskari.getSandbox().findRegisteredModuleInstance('StatsGrid');
        if (stats) {
            stats.togglePlugin.removeTool(this.id);
        }
    }
}, {
    'extend': ['Oskari.mapframework.publisher.tool.AbstractPluginTool'],
    'protocol': ['Oskari.mapframework.publisher.Tool']
});
