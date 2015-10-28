Oskari.clazz.define('Oskari.mapframework.publisher.tool.LogoTool',
function() {
}, {
    index : 1,
    allowedLocations : ['bottom left', 'bottom right'],
    lefthanded: 'bottom left',
    righthanded: 'bottom right',
    allowedSiblings : [
        'Oskari.mapframework.bundle.mapmodule.plugin.IndexMapPlugin',
        'Oskari.mapframework.bundle.mapmodule.plugin.ScaleBarPlugin',
        'Oskari.statistics.bundle.statsgrid.plugin.ManageClassificationPlugin'
    ],

    groupedSiblings : false,

    //_showInToolsPanel: false,
    /**
    * Get tool object.
    * @method getTool
    *
    * @returns {Object} tool description
    */
    getTool: function(){
        return {
            id: 'Oskari.mapframework.bundle.mapmodule.plugin.LogoPlugin',
            title: 'LogoPlugin',
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
            return {
                configuration: {
                    mapfull: {
                        conf: {
                            plugins: [{ id: this.getTool().id, config: this.getPlugin().getConfig() }]
                        }
                    }
                }
            };
        } else {
            return null;
        }
    },
    isShownInToolsPanel: function() {
        return false;
    }
}, {
    'extend' : ['Oskari.mapframework.publisher.tool.AbstractPluginTool'],
    'protocol' : ['Oskari.mapframework.publisher.Tool']
});