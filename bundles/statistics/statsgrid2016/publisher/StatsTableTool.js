Oskari.clazz.define('Oskari.mapframework.publisher.tool.StatsTableTool',
function() {
}, {
    index : 0,
    group: 'data',
    allowedLocations : [],
    allowedSiblings : [],

    groupedSiblings : false,
    templates: {
        publishedGridTemplate: '<div class="publishedgrid" ></div>'
    },
    /**
     * Initialize tool
     * @params {} state data
     * @method init
     * @public
     */
    init: function (pdata) {
        var me = this;

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
                    grid: true,
                    areaSelection: false,
                    search: false,
                    extraFeatures: false,
                    mouseEarLegend: false,
                    showLegend: true
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
            if (layer.getLayerType() === 'stats') {
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
        if(stats) {
            stats.renderPublishedLegend({showLegend:true});
        }

        if(enabled === true) {
            me.__sandbox.postRequestByName('userinterface.UpdateExtensionRequest',[me.__sandbox.findRegisteredModuleInstance('StatsGrid'), 'detach', 'StatsGrid']);
            stats.changePosition({
                top: 0,
                left: jQuery('.basic_publisher').width() + jQuery('#sidebar').width() + jQuery('#sidebar').position().left + jQuery('.basic_publisher').position().left
            });
        } else {
            me.__sandbox.postRequestByName('userinterface.UpdateExtensionRequest',[me.__sandbox.findRegisteredModuleInstance('StatsGrid'), 'close', 'StatsGrid']);
        }

        if(stats) {
            stats.renderToggleButtons(!enabled);
        }



        if (typeof me.__handlers.MapSizeChanged === 'function') {
            me.__handlers.MapSizeChanged();
        }
    },
    /**
    * Is displayed.
    * @method isDisplayed
    * @public
    *
    * @returns {Boolean} is tool displayed
    */
    isDisplayed: function() {
        var me = this,
            statsLayer = me._getStatsLayer();
        return statsLayer !== null;
    },
    getValues: function() {
        var me = this,
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
                        state: statsGridState,
                        conf : {
                            grid: me.state.enabled,
                            areaSelection: false,
                            search: false,
                            extraFeatures: false,
                            mouseEarLegend: false,
                            showLegend: true
                        }
                    }
                }
            };
        } else {
            return null;
        }
    }
}, {
    'extend' : ['Oskari.mapframework.publisher.tool.AbstractPluginTool'],
    'protocol' : ['Oskari.mapframework.publisher.Tool']
});