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

                id: 'Oskari.mapframework.publisher.tool.StatsTableTool',
                title: 'grid',
                config: {
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
            request,
            elLeft;

        me.state.enabled = enabled;

        if(!me.grid && enabled) {
            me.grid = Oskari.clazz.create('Oskari.statistics.statsgrid.Datatable', me.__sandbox);
            me.statsContainer = jQuery(me.templates.publishedGridTemplate);
        }

        if(enabled === true) {
            elLeft = jQuery('.oskariui-left');
            elLeft.html(me.statsContainer);
            me.grid.render(me.statsContainer);
        } else {
            if(me.statsContainer) {
                me.statsContainer.remove();
            }
        }

        if (me.__handlers['MapSizeChanged']) {
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
            statsGridState = me.__sandbox.getStatefulComponents().statsgrid.state || {};
        // just to make sure if user removes the statslayer while in publisher
        // if there is no statslayer on map -> don't setup publishedgrid
        // otherwise always return the state even if grid is not selected so
        //  publishedgrid gets the information it needs to render map correctly
        var statslayerOnMap = this._getStatsLayer();
        if(statslayerOnMap && statsGridState) {
            return {
                configuration: {
                    statsgrid: {
                        state: statsGridState,
                        conf : {
                            indicatorSelector : false,
                            regionSelector : false,
                            grid : me.state.enabled
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