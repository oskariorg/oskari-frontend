Oskari.clazz.define('Oskari.mapframework.publisher.tool.SeriesToggleTool', function () {
}, {
    index: 1,
    group: 'data',
    id: 'series',
    title: 'allowHidingSeriesControl',

    isDisplayed: function (data) {
        const stats = this.getStatsgridBundle();
        if (!stats) {
            return false;
        }
        const { indicators } = this.getStateHandler().getState();
        return indicators.some(ind => ind.series);
    }
}, {
    'extend': ['Oskari.mapframework.publisher.tool.AbstractStatsPluginTool'],
    'protocol': ['Oskari.mapframework.publisher.Tool']
});
