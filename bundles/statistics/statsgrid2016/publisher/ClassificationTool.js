Oskari.clazz.define('Oskari.mapframework.publisher.tool.ClassificationTool', function () {
}, {
    index: 1,
    group: 'data',
    lefthanded: 'bottom right',
    righthanded: 'bottom right',

    init: function (data) {
        const conf = this.getStatsgridConf(data);
        this.setEnabled(conf.allowClassification !== false);
    },
    // required for dragndrop in publisher - also plugin needs to
    getPlugin: function () {
        var stats = this.getStatsgridBundle();
        return stats.classificationPlugin;
    },
    getTool: function (pdata) {
        if (!this.__tool) {
            this.__tool = {
                id: 'Oskari.statistics.statsgrid.ClassificationPlugin',
                title: 'allowClassification',
                config: {
                    allowClassification: false
                }
            };
        }
        return this.__tool;
    },
    setEnabled: function (enabled) {
        if (typeof enabled !== 'boolean') {
            enabled = false;
        }

        this.state.enabled = enabled;
        const service = Oskari.getSandbox().getService('Oskari.statistics.statsgrid.StatisticsService');
        if (service) {
            service.getStateService().updateClassificationPluginState('editEnabled', enabled);
        }
    },

    getValues: function () {
        const allowClassification = this.isEnabled();
        if (!this._isStatsActive()) {
            return {};
        }
        var stats = this.getStatsgridBundle();
        const { location } = stats?.togglePlugin?.getConfig() || {};
        return {
            configuration: {
                statsgrid: {
                    conf: {
                        allowClassification,
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
    stop: function () {
        const service = Oskari.getSandbox().getService('Oskari.statistics.statsgrid.StatisticsService');
        if (service) {
            service.getStateService().resetClassificationPluginState('editEnabled');
        }
    }
}, {
    'extend': ['Oskari.mapframework.publisher.tool.AbstractStatsPluginTool'],
    'protocol': ['Oskari.mapframework.publisher.Tool']
});
