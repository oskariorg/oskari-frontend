Oskari.clazz.define('Oskari.mapframework.publisher.tool.DiagramTool', function () {
}, {
    index: 1,
    group: 'data',
    allowedLocations: [],
    allowedSiblings: [],
    id: 'diagram',

    init: function (data) {
        var enabled = data &&
            Oskari.util.keyExists(data, 'configuration.statsgrid.conf') &&
            data.configuration.statsgrid.conf.diagram === true;
        this.setEnabled(enabled);
    },
    getTool: function (stateData) {
        var me = this;
        if (!me.__tool) {
            me.__tool = {
                id: 'Oskari.statistics.statsgrid.TogglePlugin',
                title: 'displayDiagram',
                config: {
                    diagram: true
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
            stats.togglePlugin.addTool(this.id);
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
        var configExists = Oskari.util.keyExists(data, 'configuration.statsgrid.conf');
        if (!configExists) {
            return false;
        }
        if (!Oskari.getSandbox().findRegisteredModuleInstance('StatsGrid')) {
            Oskari.log('Oskari.mapframework.publisher.tool.DiagramTool')
                .warn("Published map had config, but current appsetup doesn't include StatsGrid! " +
                  'The thematic map functionality will be removed if user saves the map!!');
            return false;
        }
        return true;
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
                        diagram: me.state.enabled
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
