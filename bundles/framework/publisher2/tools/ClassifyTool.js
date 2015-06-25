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
    * @method init
    * @public
    */
    init: function(){
        var me = this,
            tool = me.getTool();

        if(!me.__plugin) {
            me.__plugin = Oskari.clazz.create(tool.id, tool.config, Oskari.getLocalization('StatsGrid'));
            me.__mapmodule.registerPlugin(me.__plugin);
            me.__plugin.startPlugin(me.__sandbox);
        }
        
        me.setEnabled(false);
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
            //me.__plugin.stopPlugin(me.__sandbox);
            me.__plugin.showClassificationOptions(false);
        }

        if(enabled === true && me.state.mode !== null && me.__plugin && typeof me.__plugin.setMode === 'function'){
            me.__plugin.setMode(me.state.mode);
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
    * @method getTool
    *
    * @returns {Object} tool description
    */
    getTool: function() {
        var me = this,
            statsGrid = me.__sandbox.getStatefulComponents().statsgrid,
            statsGridState = me._filterIndicators(_.clone(statsGrid.state, true)),
            layer = me._getStatsLayer();
        statsGridState.allowClassification  = false;
        return {
            id: 'Oskari.statistics.bundle.statsgrid.plugin.ManageClassificationPlugin',
            name: 'allowClassification',
            config: {
                'published': true,
                'layer': layer,
                'state': statsGridState
            }
        };
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
            saveState = {
                tool: me.getTool().id,
                show: me.state.enabled,
                subTools : []
            };

        return saveState;
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