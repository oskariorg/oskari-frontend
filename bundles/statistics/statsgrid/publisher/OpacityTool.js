Oskari.clazz.define('Oskari.mapframework.publisher.tool.OpacityTool', function () {
},
{
    index: 1,
    group: 'data',
    id: 'transparent',
    title: 'transparent',
    pluginId: 'Oskari.statistics.statsgrid.ClassificationPlugin',

    _setEnabledImpl: function (enabled) {
        const handler = this.getViewHandler();
        if (!handler) {
            return;
        }
        handler.getController().updateClassificationState('transparent', enabled);
    },
    _stopImpl: function () {
        const handler = this.getViewHandler();
        if (!handler) {
            return;
        }
        handler.getController().updateClassificationState('transparent');
    }
}, {
    'extend': ['Oskari.mapframework.publisher.tool.AbstractStatsPluginTool'],
    'protocol': ['Oskari.mapframework.publisher.Tool']
});
