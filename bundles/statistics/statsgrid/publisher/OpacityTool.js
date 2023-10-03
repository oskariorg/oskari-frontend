Oskari.clazz.define('Oskari.mapframework.publisher.tool.OpacityTool', function () {
},
{
    index: 1,
    group: 'data',

    init: function (data) {
        const conf = this.getStatsgridConf(data);
        this.setEnabled(conf.transparent === true);
    },
    getTool: function () {
        return {
            id: 'Oskari.statistics.statsgrid.ClassificationPlugin',
            title: 'transparent',
            config: {
                transparent: false
            },
            hasNoPlugin: true
        };
    },
    _setEnabledImpl: function (enabled) {
        var stats = this.getStatsgridBundle();
        if (!stats) {
            return;
        }
        if (!stats.classificationPlugin) {
            stats.createClassificationView();
        }
        stats.getStatisticsService().getStateService().updateClassificationPluginState('transparent', enabled);
    },
    getValues: function () {
        return this.getConfiguration({ transparent: this.isEnabled() });
    },
    _stopImpl: function () {
        const service = Oskari.getSandbox().getService('Oskari.statistics.statsgrid.StatisticsService');
        if (service) {
            service.getStateService().resetClassificationPluginState('transparent');
        }
    }
}, {
    'extend': ['Oskari.mapframework.publisher.tool.AbstractStatsPluginTool'],
    'protocol': ['Oskari.mapframework.publisher.Tool']
});
