Oskari.clazz.define('Oskari.mapframework.publisher.tool.PanButtonsTool',
function() {
}, {
    index : 2,
    allowedLocations : ['top left', 'top right', 'bottom left', 'bottom right'],
    allowedSiblings : [
        'Oskari.mapframework.bundle.featuredata2.plugin.FeaturedataPlugin',
        'Oskari.mapframework.bundle.mapmodule.plugin.MyLocationPlugin',
        'Oskari.mapframework.bundle.mapmodule.plugin.Portti2Zoombar'
    ],

    groupedSiblings : true,

    /**
    * Get tool object.
    * @method getTool
    *
    * @returns {Object} tool description
    */
    getTool: function(){
        return {
            id: 'Oskari.mapframework.bundle.mapmodule.plugin.PanButtons',
            name: 'PanButtons',
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
        var me = this,
            saveState = {
                tool: me.getTool().id,
                show: me.state.enabled,
                subTools : []
            };

        return saveState;
    }
}, {
    'extend' : ['Oskari.mapframework.publisher.tool.AbstractPluginTool'],
    'protocol' : ['Oskari.mapframework.publisher.Tool']
});