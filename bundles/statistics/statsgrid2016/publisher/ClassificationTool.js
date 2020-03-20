Oskari.clazz.define('Oskari.mapframework.publisher.tool.ClassificationTool', function () {
}, {
    index: 1,
    group: 'data',
    allowedLocations: ['bottom right'],
    lefthanded: 'bottom right',
    righthanded: 'bottom right',

    allowedSiblings: [
        'Oskari.mapframework.bundle.mapmodule.plugin.ScaleBarPlugin',
        'Oskari.mapframework.bundle.mapmodule.plugin.LogoPlugin',
        'Oskari.mapframework.bundle.mapmodule.plugin.IndexMapPlugin'
    ],
    init: function (pdata) {
        if (pdata && Oskari.util.keyExists(pdata, 'configuration.statsgrid.conf') && pdata.configuration.statsgrid.conf.allowClassification !== false) {
            this.setEnabled(true);
        } else {
            this.setEnabled(false);
        }
    },
    // required for dragndrop in publisher - also plugin needs to
    getPlugin: function () {
        var stats = Oskari.getSandbox().findRegisteredModuleInstance('StatsGrid');
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
        const legendLocation = 'bottom right';
        if (this._isStatsActive()) {
            return {
                configuration: {
                    statsgrid: {
                        conf: { allowClassification, legendLocation },
                        state: this.__sandbox.getStatefulComponents().statsgrid.getState()
                    }
                }
            };
        }
        return {};
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
        // HACK: remove when publisher doesn't delete all draggables
        setTimeout(() => this.getPlugin()._makeDraggable(), 500);
    }
}, {
    'extend': ['Oskari.mapframework.publisher.tool.AbstractStatsPluginTool'],
    'protocol': ['Oskari.mapframework.publisher.Tool']
});
