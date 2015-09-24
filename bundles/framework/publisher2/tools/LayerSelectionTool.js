Oskari.clazz.define('Oskari.mapframework.publisher.tool.LayerSelectionTool',
function() {
}, {
    index : 1,
    allowedLocations: ['top left', 'top center', 'top right'],
    lefthanded: 'top right',
    righthanded: 'top left',
    allowedSiblings: [
        'Oskari.mapframework.bundle.featuredata2.plugin.FeaturedataPlugin',
        'Oskari.mapframework.bundle.mapmodule.plugin.PublisherToolbarPlugin',
        'Oskari.mapframework.bundle.mapmodule.plugin.SearchPlugin'
    ],
    groupedSiblings: false,

    /**
    * Get tool object.
    * @method getTool
    *
    * @returns {Object} tool description
    */
    getTool: function(){
        return {
            id: 'Oskari.mapframework.bundle.mapmodule.plugin.LayerSelectionPlugin',
            name: 'LayerSelectionPlugin',
            config: {}
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
        var me = this;

        if(me.state.enabled) {
            var pluginConfig = { id: this.getTool().id, config: this.getPlugin().getConfig()};
            var layerSelection = me._getLayerSelection();
            if (layerSelection && !jQuery.isEmptyObject(layerSelection)) {
                pluginConfig.layerSelection = layerSelection;
            }
            return {
                configuration: {
                    mapfull: {
                        conf: {
                            plugins: [pluginConfig]
                        }
                    }
                }
            };
        } else {
            return null;
        }
    },
    _getLayerSelection: function () {
        var me = this,
            layerSelection = {};
        var pluginValues = me.getPlugin().getBaseLayers();
        if (pluginValues.defaultBaseLayer) {
            layerSelection.baseLayers =
                pluginValues.baseLayers;
            layerSelection.defaultBaseLayer =
                pluginValues.defaultBaseLayer;
        }
        return layerSelection;
    }
}, {
    'extend' : ['Oskari.mapframework.publisher.tool.AbstractPluginTool'],
    'protocol' : ['Oskari.mapframework.publisher.Tool']
});