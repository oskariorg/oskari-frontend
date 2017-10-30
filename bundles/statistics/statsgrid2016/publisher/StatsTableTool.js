Oskari.clazz.define('Oskari.mapframework.publisher.tool.StatsTableTool',
function() {
}, {
    index : 0,
    group: 'data',
    allowedLocations : [],
    allowedSiblings : [],

    groupedSiblings : false,
    templates: {},
    /**
     * Initialize tool
     * @params {} state data
     * @method init
     * @public
     */
    init: function (pdata) {
        var me = this;

        var stats = Oskari.getSandbox().findRegisteredModuleInstance('StatsGrid');
        if (pdata && Oskari.util.keyExists(pdata, 'configuration.statsgrid.conf') && pdata.configuration.statsgrid.conf.grid !== false) {
            me.setEnabled(true);
        } else {
            me.setEnabled(false);
        }
    },
    /**
    * Get tool object.
     * @params {}  pdta.configuration.publishedgrid.state
    * @method getTool
    * @private
    *
    * @returns {Object} tool
    */
    getTool: function(pdata){
        var me = this;
        if(!me.__tool) {
            me.__tool = {
                id: 'Oskari.statistics.statsgrid.StatsGridBundleInstance',
                title: 'grid',
                config: {
                    grid: true
                }
            };
         }
        return me.__tool;
    },
    /**
    * Get stats layer.
    * @method @private _getStatsLayer
    *
    * @return founded stats layer, if not found then null
    */
    _getStatsLayer: function(){
        var me = this,
            selectedLayers = me.__sandbox.findAllSelectedMapLayers(),
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
    /**
    * Set enabled.
    * @method setEnabled
    * @public
    *
    * @param {Boolean} enabled is tool enabled or not
    */

    setEnabled : function(enabled) {
        var me = this,
            tool = me.getTool(),
            statsLayer = me._getStatsLayer(),
            request;

        me.state.enabled = enabled;

        var stats = Oskari.getSandbox().findRegisteredModuleInstance('StatsGrid');
        if(!stats) {
            return;
        }
        stats.showToggleButtons(enabled);
    },
    /**
    * Is displayed.
    * @method isDisplayed
    * @public
    *
    * @returns {Boolean} is tool displayed
    */
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
        // if there is no statslayer on map -> don't setup statsgrid
        // otherwise always return the state even if grid is not selected so
        // statsgrid gets the information it needs to render map correctly
        var statslayerOnMap = this._getStatsLayer();
        if(!statslayerOnMap || !statsGridState) {
            return null;
        }
        return {
            configuration: {
                statsgrid: {
                    state: statsGridState,
                    conf : {
                        grid: me.state.enabled,
                        vectorViewer: config.vectorViewer
                    }
                }
            }
        };
    },
    stop : function() {
        var stats = Oskari.getSandbox().findRegisteredModuleInstance('StatsGrid');
        if(stats) {
            stats.showToggleButtons(false);
        }
    }
}, {
    'extend' : ['Oskari.mapframework.publisher.tool.AbstractPluginTool'],
    'protocol' : ['Oskari.mapframework.publisher.Tool']
});