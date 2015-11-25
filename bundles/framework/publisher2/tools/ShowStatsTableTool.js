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
         * Initialize tool
         * @params {} state data
         * @method init
         * @public
         */
        init: function (pdata) {
            var me = this,
                tool = me.getTool(pdata);


            me.setEnabled(false);
        },
    bundleName: 'publishedgrid',
    /**
    * Get tool object.
     * @params {}  pdta.configuration.publishedgrid.state
    * @method getTool
    * @private
    *
    * @returns {Object} tool
    */
    getTool: function(pdata){
        var me = this,
            statsGrid = me.__sandbox.getStatefulComponents().statsgrid,
            statsGridState = Oskari.util.keyExists(pdata, 'configuration.publishedgrid.state') ? pdata.configuration.publishedgrid.state : statsGrid.state,
            layer = me._getStatsLayer();

        if(!me.__tool) {
            statsGridState = me._filterIndicators(_.clone(statsGridState, true));

            me.__tool = {

                id: 'Oskari.statistics.bundle.statsgrid.plugin.ManageStatsPlugin',
                title: 'grid',
                config: {
                    'published': true,
                    'layer': layer,
                    'state': statsGridState
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
            me.__started = true;
        } else {
            if (me.__started === true) {
                me.__plugin.stopPlugin(me.__sandbox);
            }
            jQuery('.publishedgrid').remove();
        }

        if(enabled === true && me.state.mode !== null && me.__plugin && typeof me.__plugin.setMode === 'function'){
            me.__plugin.setMode(me.state.mode);
        }

        if (enabled) {
            if(me.__handlers['MapSizeChanged']) {
                me.__handlers.MapSizeChanged();
            }
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
    },
    getValues: function() {
        var me = this,
            statsGridState = me._getState();
        if(me.state.enabled && statsGridState) {
            return {
                configuration: {
                    publishedgrid: {
                        state: statsGridState
                    }
                }
            };
        } else {
            return null;
        }
    },
        /**
         * @private @method _getState
         * Get state config from current tool, if sandbox returns  default config
         *
         */
        _getState: function () {
            var me = this,
                statsGrid = me.__sandbox.getStatefulComponents().statsgrid,
                statsGridState = statsGrid.state;

            statsGridState.gridShown = me.state.enabled;
            // Grid state is not in sandbox, if no touch to grid in view edit mode
            // TODO improve state management in statsgrid
            if(!('currentColumn' in statsGrid.state) && me.__tool) {
                statsGridState = me.__tool.config.state;
            }
            return me._filterIndicators(_.clone(statsGridState, true));
        }
}, {
    'extend' : ['Oskari.mapframework.publisher.tool.AbstractPluginTool'],
    'protocol' : ['Oskari.mapframework.publisher.Tool']
});