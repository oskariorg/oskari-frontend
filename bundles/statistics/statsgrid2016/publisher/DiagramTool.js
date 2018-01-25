Oskari.clazz.define('Oskari.mapframework.publisher.tool.DiagramTool',
function() {},
{
    index : 1,
    group: 'data',
    allowedLocations : ['bottom left', 'bottom right'],
    lefthanded: 'bottom right',
    righthanded: 'bottom left',

    allowedSiblings : [],
    bundleName: 'statsgrid',
    init: function (data) {
        var me = this;
        if ( !data || !data.configuration[me.bundleName] ) {
            return;
        }
        var stats = Oskari.getSandbox().findRegisteredModuleInstance('StatsGrid');
        if ( stats && this.isDisplayed(data) ) {
            stats.showDiagramOnMap(true);
        }
    },
    getTool: function(stateData){
        var me = this;
        if(!me.__tool) {
            me.__tool = {
                id: 'Oskari.statistics.statsgrid.plugin.DiagramPlugin',
                title: 'displayDiagram',
                config: {
                    displayDiagram: true
                }
            };
         }
        return me.__tool;
    },
    /**
    * Get stats layer.
    * @method @private _getStatsLayer
    *
    * @return found stats layer, if not found then null
    */
    _getStatsLayer: function(){
        var me = this,
            selectedLayers = Oskari.getSandbox().findAllSelectedMapLayers(),
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
    isDisplayed: function (data) {
        var hasStatsLayerOnMap = this._getStatsLayer() !== null;
        if(hasStatsLayerOnMap) {
            return true;
        }
        var configExists = Oskari.util.keyExists(data, 'configuration.statsgrid.conf');
        if(!configExists) {
            return false;
        }
        if(!Oskari.getSandbox().findRegisteredModuleInstance('StatsGrid')) {
            Oskari.log('Oskari.mapframework.publisher.tool.DiagramTool')
                .warn("Published map had config, but current appsetup doesn't include StatsGrid! " +
                  "The thematic map functionality will be removed if user saves the map!!");
            return false;
        }
        return true;
    },

}, {
    'extend' : ['Oskari.mapframework.publisher.tool.AbstractPluginTool'],
    'protocol' : ['Oskari.mapframework.publisher.Tool']
});