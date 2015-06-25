Oskari.clazz.define('Oskari.mapframework.publisher.tool.ScalebarTool',
function() {
}, {
    index : 0,
    allowedLocations : ['bottom left', 'bottom right'],
    allowedSiblings : [
        'Oskari.mapframework.bundle.mapmodule.plugin.IndexMapPlugin',
        'Oskari.mapframework.bundle.mapmodule.plugin.LogoPlugin',
        'Oskari.statistics.bundle.statsgrid.plugin.ManageClassificationPlugin'
    ],

    groupedSiblings : false,
    /**
    * Get tool object.
    * @method getTool
    * @private
    *
    * @returns {Object} tool
    */
    getTool: function(){
        return {
            id: 'Oskari.mapframework.bundle.mapmodule.plugin.ScaleBarPlugin',
            name: 'ScaleBarPlugin',
            config: {}
        };
    }
}, {
    'extend' : ['Oskari.mapframework.publisher.tool.AbstractPluginTool'],
    'protocol' : ['Oskari.mapframework.publisher.Tool']
});