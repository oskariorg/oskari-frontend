Oskari.clazz.define('Oskari.mapframework.publisher.tool.IndexMapTool',
function() {
}, {
    index : 1,
    allowedLocations : ['bottom left', 'bottom right'],
    allowedSiblings : [
        'Oskari.mapframework.bundle.mapmodule.plugin.LogoPlugin',
        'Oskari.mapframework.bundle.mapmodule.plugin.ScaleBarPlugin',
        'Oskari.statistics.bundle.statsgrid.plugin.ManageClassificationPlugin'
    ],

    groupedSiblings : false,

    /**
    * Get tool object.
    * @method getTool
    *
    * @returns {Object} tool description
    */
    getTool: function(){
        return {
            id: 'Oskari.mapframework.bundle.mapmodule.plugin.IndexMapPlugin',
            name: 'IndexMapPlugin',
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