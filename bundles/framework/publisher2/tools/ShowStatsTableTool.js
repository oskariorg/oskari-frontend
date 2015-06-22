Oskari.clazz.define('Oskari.mapframework.publisher.tool.ShowStatsTableTool',
function() {
}, {
    index : 0,
    group: 'data',
    allowedLocations : [],
    allowedSiblings : [],

    groupedSiblings : false,
    templates: {
        publishedGridTemplate: '<div class="publishedgrid"></div>'
    },
    /**
    * Get tool object.
    * @method getTool
    * @private
    *
    * @returns {Object} tool
    */
    getTool: function(){
        var me = this,
            statsGrid = me.__sandbox.getStatefulComponents().statsgrid,
            statsGridState = me._filterIndicators(_.clone(statsGrid.state, true)),
            layer = me._getStatsLayer();
        return {
            id: 'Oskari.statistics.bundle.statsgrid.plugin.ManageStatsPlugin',
            name: 'grid',
            config: {
                'published': true,
                'layer': layer,
                'state': statsGridState
            }
        };
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
            elLeft,
            statsContainer;

        me.state.enabled = enabled;

        if(!me.__plugin && enabled) {
            me.statsService = Oskari.clazz.create(
                'Oskari.statistics.bundle.statsgrid.StatisticsService',
                me.__instance
            );
            if(statsLayer){
                request = me.__sandbox.getRequestBuilder('StatsGrid.StatsGridRequest')(false, statsLayer);
                me.__sandbox.request(me.__instance, request);
            }
            me.__sandbox.registerService(me.statsService);            
            me.__plugin = Oskari.clazz.create(tool.id, tool.config, Oskari.getLocalization('StatsGrid'));
            me.__mapmodule.registerPlugin(me.__plugin);
            me.statsContainer = jQuery(me.templates.publishedGridTemplate);
        }

        if(enabled === true) {
            elLeft = jQuery('.oskariui-left');
            elLeft.html(me.statsContainer);
            me.__plugin.startPlugin(me.__sandbox);
            me.__plugin.createStatsOut(me.statsContainer);
        } else {
            me.__plugin.stopPlugin(me.__sandbox);
            jQuery('.publishedgrid').remove();
        }

        if(me.__handlers['MapSizeChanged']) {
            me.__handlers.MapSizeChanged();
        }

        if(enabled === true && me.state.mode !== null && me.__plugin && typeof me.__plugin.setMode === 'function'){
            me.__plugin.setMode(me.state.mode);
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
    /**
     * @private @method _filterIndicators
     * Filters out user's indicators which aren't allowed to be published.
     *
     * @param  {Object} statsGridState
     *
     * @return {Object} filtered state
     */
    _filterIndicators: function (statsGridState) {
        statsGridState.indicators = _.filter(statsGridState.indicators, function (indicator) {
            return (
                // indicators
                (!indicator.ownIndicator) ||
                // own indicators
                (indicator.ownIndicator && indicator.public)
            );
        });
        return statsGridState;
    }
}, {
    'extend' : ['Oskari.mapframework.publisher.tool.AbstractPluginTool'],
    'protocol' : ['Oskari.mapframework.publisher.Tool']
});