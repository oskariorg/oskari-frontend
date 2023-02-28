Oskari.clazz.define('Oskari.mapframework.publisher.tool.OpacityTool', function () {
},
{
    index: 1,
    group: 'data',

    init: function (data) {
        var enabled = data &&
            Oskari.util.keyExists(data, 'configuration.statsgrid.conf') &&
            data.configuration.statsgrid.conf.transparent === true;
        this.setEnabled(enabled);
    },
    getTool: function (stateData) {
        var me = this;
        if (!me.__tool) {
            me.__tool = {
                id: 'Oskari.statistics.statsgrid.ClassificationPlugin',
                title: 'transparent',
                config: {
                    transparent: false
                }
            };
        }
        return me.__tool;
    },
    setEnabled: function (enabled) {
        var me = this;

        me.state.enabled = enabled;

        var stats = Oskari.getSandbox().findRegisteredModuleInstance('StatsGrid');
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
    stop: function () {
        const service = Oskari.getSandbox().getService('Oskari.statistics.statsgrid.StatisticsService');
        if (service) {
            service.getStateService().resetClassificationPluginState('transparent');
        }
    }
}, {
    'extend': ['Oskari.mapframework.publisher.tool.AbstractStatsPluginTool'],
    'protocol': ['Oskari.mapframework.publisher.Tool']
});
