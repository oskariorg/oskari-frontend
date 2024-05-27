Oskari.clazz.define('Oskari.mapframework.publisher.tool.ClassificationToggleTool', function () {
}, {
    index: 1,
    group: 'data',
    id: 'classification',
    title: 'allowHidingClassification',

    init: function (data) {
        const conf = this.getStatsgridConf(data);
        this.setEnabled(conf.classification === true);
    },
    getTool: function () {
        return {
            ...this.getToolInfo(),
            config: {
                classification: true
            }
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
            // if we have hidden classification and then remove the option to hide/show it
            // -> update visibility to show it
            stats.updateClassficationViewVisibility();
        }
    },
    getValues: function () {
        return this.getConfiguration({ classification: this.isEnabled() });
    },
    _stopImpl: function () {
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
