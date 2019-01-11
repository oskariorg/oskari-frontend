Oskari.clazz.define('Oskari.mapframework.publisher.tool.ClassificationToggleTool', function () {
}, {
    index: 1,
    group: 'data',
    allowedLocations: [],
    allowedSiblings: [],
    id: 'classification',

    init: function (data) {
        var enabled = data &&
            Oskari.util.keyExists(data, 'configuration.statsgrid.conf') &&
            data.configuration.statsgrid.conf.classification === true;
        this.setEnabled(enabled);
    },
    getTool: function (stateData) {
        var me = this;
        if (!me.__tool) {
            me.__tool = {
                id: 'Oskari.statistics.statsgrid.TogglePlugin',
                title: 'allowHidingClassification',
                config: {
                    classification: true
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
    /**
    * Get stats layer.
    * @method @private _getStatsLayer
    *
    * @return found stats layer, if not found then null
    */
    _getStatsLayer: function () {
        var selectedLayers = Oskari.getSandbox().findAllSelectedMapLayers();
        var statsLayer = null;
        var layer;
        for (var i = 0; i < selectedLayers.length; i += 1) {
            layer = selectedLayers[i];
            if (layer.getId() === 'STATS_LAYER') {
                statsLayer = layer;
                break;
            }
        }
        return statsLayer;
    },
    isDisplayed: function (data) {
        var hasStatsLayerOnMap = this._getStatsLayer() !== null;
        if (hasStatsLayerOnMap) {
            return true;
        }
        return Oskari.util.keyExists(data, 'configuration.statsgrid.conf');
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
                        classification: me.state.enabled
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
