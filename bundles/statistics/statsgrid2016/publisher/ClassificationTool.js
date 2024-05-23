Oskari.clazz.define('Oskari.mapframework.publisher.tool.ClassificationTool', function () {
}, {
    index: 1,
    group: 'data',
    title: 'allowClassification',

    init: function (data) {
        const conf = this.getStatsgridConf(data);
        this.setEnabled(conf.allowClassification !== false);
    },
    // required for dragndrop in publisher - also plugin needs to
    getPlugin: function () {
        var stats = this.getStatsgridBundle();
        return stats.classificationPlugin;
    },
    getTool: function () {
        return {
            id: 'Oskari.statistics.statsgrid.ClassificationPlugin',
            title: this.getTitle(),
            config: {
                allowClassification: false
            },
            hasNoPlugin: true
        };
    },
    _setEnabledImpl: function (enabled) {
        const service = Oskari.getSandbox().getService('Oskari.statistics.statsgrid.StatisticsService');
        if (service) {
            service.getStateService().updateClassificationPluginState('editEnabled', enabled);
        }
    },

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
    },
    /**
    * Stop tool.
    * @method stop
    * @public
    */
    _stopImpl: function () {
        const service = Oskari.getSandbox().getService('Oskari.statistics.statsgrid.StatisticsService');
        if (service) {
            service.getStateService().resetClassificationPluginState('editEnabled');
        }
    }
}, {
    'extend': ['Oskari.mapframework.publisher.tool.AbstractStatsPluginTool'],
    'protocol': ['Oskari.mapframework.publisher.Tool']
});
