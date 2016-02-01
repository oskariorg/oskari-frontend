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

        if (pdata && Oskari.util.keyExists(pdata, 'configuration.publishedgrid.state.gridShown') && pdata.configuration.publishedgrid.state.gridShown === true) {
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
        var me = this,
            statsGrid = me.__sandbox.getStatefulComponents().statsgrid,
            statsGridState = Oskari.util.keyExists(pdata, 'configuration.publishedgrid.state') ? pdata.configuration.publishedgrid.state : statsGrid._getState(),
            layer = me._getStatsLayer();

        if(!me.__tool) {
            statsGridState = me._filterIndicators(_.clone(statsGridState, true));
            statsGridState.embedded = true;
            statsGridState.layerId = layer._id;

            me.__tool = {

                id: 'Oskari.statistics.bundle.statsgrid.view.MainPanel',
                title: 'grid',
                config: {
                    'localization': Oskari.getLocalization('StatsGrid'),
                    'sandbox': me.__sandbox,
                    // FIXME: Are the next useful in the published grid?
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
            statsContainer,
            statsGrid = me.__sandbox.getStatefulComponents().statsgrid,
            statsGridState = statsGrid.state;

        statsGridState = me._filterIndicators(_.clone(statsGridState, true));
        statsGridState.embedded = true;
        statsGridState.layerId = statsLayer._id;

        me.state.enabled = enabled;

        if(!me.__plugin) {
            me.statsService = Oskari.clazz.create(
                'Oskari.statistics.bundle.statsgrid.StatisticsService',
                me.__instance.sandbox
            );
            if(statsLayer){
                request = me.__sandbox.getRequestBuilder('StatsGrid.StatsGridRequest')(false, statsLayer);
                me.__sandbox.request(me.__instance, request);
            }
            me.__sandbox.registerService(me.statsService);
            me.__plugin = Oskari.clazz.create(tool.id, me, tool.config.localization, tool.config.sandbox);
        }
        me.statsContainer = jQuery('.publishedgrid');
        if(me.statsContainer.length == 0) {
            var elLeft = jQuery('.oskariui-left');
            me.statsContainer = jQuery(me.templates.publishedGridTemplate);
            elLeft.html(me.statsContainer);
        }

        if(enabled === true) {
            me.__plugin.embedded = true;
            me.__plugin.state = statsGridState;
            me.__plugin.statslayer = statsLayer;
            me.__plugin.render(me.statsContainer, me);
            me.__started = true;
        } else {
            me.statsContainer.empty();
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
        statsGridState.selectedIndicators = _.filter(statsGridState.selectedIndicators, function (indicator) {
            var ownIndicator = indicator.datasourceId == "fi.nls.oskari.control.statistics.plugins.user.UserIndicatorsStatisticalDatasourcePlugin";
            return (
                // indicators
                (!ownIndicator) ||
                // own indicators
                (ownIndicator && indicator.public)
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
         */
        _getState: function () {
            return {
                gridShown: this.state.enabled
            };
        }
}, {
    'extend' : ['Oskari.mapframework.publisher.tool.AbstractPluginTool'],
    'protocol' : ['Oskari.mapframework.publisher.Tool']
});