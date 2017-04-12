Oskari.clazz.define('Oskari.mapframework.publisher.tool.ClassifyTool',
function() {
}, {
    index : 1,
    group: 'data',
    allowedLocations : ['bottom right'],
    allowedSiblings : [
        'Oskari.mapframework.bundle.mapmodule.plugin.IndexMapPlugin',
        'Oskari.mapframework.bundle.mapmodule.plugin.LogoPlugin',
        'Oskari.mapframework.bundle.mapmodule.plugin.ScaleBarPlugin'
    ],

    groupedSiblings : false,

    /**
    * Initialize tool
    * @params {} state data
    * @method init
    * @public
    */
    init: function(pdata){
        var me = this,
            tool = me.getTool(pdata);

        if(!me.__plugin) {
            me.__plugin = Oskari.clazz.create(tool.id, tool.config, Oskari.getLocalization('StatsGrid'));
            me.__mapmodule.registerPlugin(me.__plugin);
            me.__plugin.startPlugin(me.__sandbox);
        }

        if (pdata && Oskari.util.keyExists(pdata, 'configuration.publishedgrid.conf.allowClassification') && pdata.configuration.publishedgrid.conf.allowClassification === true) {
            me.setEnabled(true);
        } else {
            me.setEnabled(false);
        }
    },
    /**
    * Set enabled.
    * @method setEnabled
    * @public
    *
    * @param {Boolean} enabled is tool enabled or not
    */
    setEnabled : function(enabled) {
        var me = this;

        me.state.enabled = enabled;

        if(enabled === true) {
            me.__plugin.showClassificationOptions(true);
        } else {
            me.__plugin.showClassificationOptions(false);
        }
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
    * Get tool object.
    * @params {} state data
    * @method getTool
    *
    * @returns {Object} tool description
    */
    getTool: function(pdata) {
        var me = this,
            statsGrid = me.__sandbox.getStatefulComponents().statsgrid,
            statsGridState = Oskari.util.keyExists(pdata, 'configuration.publishedgrid.state') ? pdata.configuration.publishedgrid.state : statsGrid.state;

        if(!me.__tool){
            statsGridState = me._filterIndicators(_.clone(statsGridState, true));
            statsGridState.allowClassification  = false;
            me.__tool = {
                id: 'Oskari.statistics.bundle.statsgrid.plugin.ManageClassificationPlugin',
                title: 'allowClassification',
                config: {
                    'published': true,
                    'state': statsGridState
                }
            };
        }
        return me.__tool;

    },
    /**
    * Get values.
    * @method getValues
    * @public
    *
    * @returns {Object} tool value object
    */
    getValues: function () {
        var me = this,
            statsGridState = me._getState();
        if(me.state.enabled && statsGridState) {
            return {
                configuration: {
                    publishedgrid: {
                        conf: {
                            allowClassification: true
                        },
                        state: statsGridState
                    }
                }
            };
        } else {
            return null;
        }
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
            const ownIndicator = indicator.datasourceId == "fi.nls.oskari.control.statistics.plugins.user.UserIndicatorsStatisticalDatasourcePlugin";
            return (
                // indicators
                (!ownIndicator) ||
                // own indicators
                (ownIndicator && indicator.public)
            );
        });
        return statsGridState;
    },
        /**
         * @private @method _getState
         * Get state config from current tool, if sandbox returns  default config
         *
         */
        _getState: function () {
            return {
                classifyShown:  this.state.enabled
            };
        },
        stop : function() {
            jQuery('.mapplugin.manageClassificationPlugin').remove();
            var plugin = this.__plugin;
            if(!plugin) {
                return;
            }
            if(this.__sandbox) {
                plugin.stopPlugin(this.__sandbox);
            }
            this.__mapmodule.unregisterPlugin(plugin);
        }
}, {
    'extend' : ['Oskari.mapframework.publisher.tool.AbstractPluginTool'],
    'protocol' : ['Oskari.mapframework.publisher.Tool']
});