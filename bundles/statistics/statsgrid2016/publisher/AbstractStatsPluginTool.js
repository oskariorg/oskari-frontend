Oskari.clazz.define('Oskari.mapframework.publisher.tool.AbstractStatsPluginTool', function () {
}, {
    /**
    * Get stats layer.
    * @method @private _getStatsLayer
    *
    * @return found stats layer, if not found then null
    */
    _getStatsLayer: function () {
        return Oskari.getSandbox().findAllSelectedMapLayers().find(lyr => lyr.getId() === 'STATS_LAYER');
    }
}, {
    'extend': ['Oskari.mapframework.publisher.tool.AbstractPluginTool']
});
