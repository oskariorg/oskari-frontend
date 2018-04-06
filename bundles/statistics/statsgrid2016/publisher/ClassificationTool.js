Oskari.clazz.define('Oskari.mapframework.publisher.tool.ClassificationTool',
function() {
}, {
    index : 1,
    group: 'data',
    allowedLocations : ['top left', 'top right'],
    lefthanded: 'top right',
    righthanded: 'top left',

    allowedSiblings : [
        'Oskari.mapframework.bundle.mapmodule.plugin.MyLocationPlugin',
        'Oskari.mapframework.bundle.mapmodule.plugin.PanButtons',
        'Oskari.mapframework.bundle.mapmodule.plugin.Portti2Zoombar'
    ],
    init: function (pdata) {
        var stats = Oskari.getSandbox().findRegisteredModuleInstance('StatsGrid');
        if ( stats ) {
            stats.createClassficationView(true);
        }
        if (pdata && Oskari.util.keyExists(pdata, 'configuration.statsgrid.conf') && pdata.configuration.statsgrid.conf.allowClassification !== false) {
            this.setEnabled(true);
        } else {
            this.setEnabled(false);
        }
    },
    // required for dragndrop in publisher - also plugin needs to
    getPlugin : function() {
        var stats = Oskari.getSandbox().findRegisteredModuleInstance('StatsGrid');
        return stats.classificationPlugin;
    },
    getTool: function(pdata) {
        if(!this.__tool) {
            this.__tool = {
                id: 'Oskari.statistics.statsgrid.ClassificationPlugin',
                title: 'allowClassification',
                config: {
                    allowClassification: false,
                }
            };
         }
        return this.__tool;
    },
    _getStatsLayer: function() {
            var selectedLayers = this.__sandbox.findAllSelectedMapLayers(),
            statsLayer = null,
            layer;
        for (i = 0; i < selectedLayers.length; i += 1) {
            layer = selectedLayers[i];
            if (layer.getId() === 'STATS_LAYER') {
                statsLayer = layer;
                break;
            }
        }
        return statsLayer;
    },
    setEnabled : function(enabled) {
        if(typeof enabled !== 'boolean') {
            enabled = false;
        }

        this.state.enabled = enabled;
        var stats = Oskari.getSandbox().findRegisteredModuleInstance('StatsGrid');

        this.getPlugin().enableClassification(enabled);

    },
    isDisplayed: function(data) {
        var hasStatsLayerOnMap = this._getStatsLayer() !== null;
        if(hasStatsLayerOnMap) {
            // If there's a statslayer on the map show the tool for statistics functionality
            // relevant when creating a new published map
            return true;
        }
        // If there isn't one, the user hasn't visited the functionality on this session
        // Check if the user is editing a map with statslayer
        var configExists = Oskari.util.keyExists(data, 'configuration.statsgrid.conf');
        if(!configExists) {
            return false;
        }
        if(!Oskari.getSandbox().findRegisteredModuleInstance('StatsGrid')) {
            Oskari.log('Oskari.mapframework.publisher.tool.ClassificationTool')
                .warn("Published map had config, but current appsetup doesn't include StatsGrid! " +
                  "The thematic map functionality will be removed if user saves the map!!");
            return false;
        }
        return true;
    },
    getValues: function() {
        var me = this,
            config  = me.__sandbox.getStatefulComponents().statsgrid.getConfiguration(),
            statsGridState = me.__sandbox.getStatefulComponents().statsgrid.getState();
        // just to make sure if user removes the statslayer while in publisher
        // if there is no statslayer on map -> don't setup publishedgrid
        // otherwise always return the state even if grid is not selected so
        //  publishedgrid gets the information it needs to render map correctly
        var statslayerOnMap = this._getStatsLayer();
        if(statslayerOnMap && statsGridState) {
            // without view = true -> the sidepanel is not shown when the statsgrid bundle starts
            statsGridState.view = me.state.enabled;
            return {
                configuration: {
                    statsgrid: {
                        conf : {
                            allowClassification: me.state.enabled,
                            legendLocation : 'right top'
                        }
                    }
                }
            };
        } else {
            return {};
        }
    },
    /**
    * Stop tool.
    * @method stop
    * @public
    */
    stop: function() {
        var stats = Oskari.getSandbox().findRegisteredModuleInstance('StatsGrid');
        if(stats) {
            stats.enableClassification(true);
            stats.createClassficationView(false);
        }
    }
}, {
    'extend' : ['Oskari.mapframework.publisher.tool.AbstractPluginTool'],
    'protocol' : ['Oskari.mapframework.publisher.Tool']
});