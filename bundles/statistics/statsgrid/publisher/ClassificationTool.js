Oskari.clazz.define('Oskari.mapframework.publisher.tool.ClassificationTool', function () {
}, {
    index: 1,
    group: 'data',
    id: 'allowClassification',
    title: 'allowClassification',

    // required for dragndrop in publisher - also plugin needs to
    getPlugin: function () {
        var stats = this.getStatsgridBundle();
        return stats.classificationPlugin;
    },
    _setEnabledImpl: function (enabled) {
        const handler = this.getViewHandler();
        if (!handler) {
            return;
        }
        handler.getController().updateClassificationState('editEnabled', enabled);
    },
    _stopImpl: function () {
        const handler = this.getViewHandler();
        if (!handler) {
            return;
        }
        handler.getController().updateClassificationState('editEnabled');
    },
    // TODO: is this main tool (always included)??
    getValues: function () {
        if (!this._isStatsActive()) {
            return null;
        }
        var stats = this.getStatsgridBundle();
        const { location } = stats?.togglePlugin?.getConfig() || {};
        return {
            configuration: {
                statsgrid: {
                    conf: {
                        allowClassification: this.isEnabled(),
                        location: location || {
                            classes: 'bottom right'
                        }
                    },
                    state: this.__sandbox.getStatefulComponents().statsgrid.getState()
                }
            }
        };
    }
}, {
    'extend': ['Oskari.mapframework.publisher.tool.AbstractStatsPluginTool'],
    'protocol': ['Oskari.mapframework.publisher.Tool']
});
